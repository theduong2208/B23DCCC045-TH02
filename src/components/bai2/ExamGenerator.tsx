import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  InputNumber,
  Input,
  message,
  Typography
} from 'antd';
import { ExamStructure, Subject, Question } from '../../interfaces/types';
import { LocalStorageService } from '../../services/bai2/localStorageService';
import { ExamService } from '../../services/bai2/examService';

const { Option } = Select;
const { Text } = Typography;

function ExamGenerator() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [exams, setExams] = useState<ExamStructure[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

  useEffect(() => {
    setSubjects(LocalStorageService.getItem<Subject[]>('subjects') || []);
    setQuestions(LocalStorageService.getItem<Question[]>('questions') || []);
    setExams(LocalStorageService.getItem<ExamStructure[]>('exams') || []);
  }, []);

  const handleAddQuestionById = (id: string) => {
    const question = questions.find(q => q.id === id);
    if (question) {
      if (!selectedQuestions.find(q => q.id === id)) {
        setSelectedQuestions(prev => [...prev, question]);
        message.success('Đã thêm câu hỏi vào đề thi');
      } else {
        message.warning('Câu hỏi đã tồn tại trong danh sách');
      }
    } else {
      message.error('Không tìm thấy câu hỏi với ID này');
    }
  };

  const handleGenerate = (values: any) => {
    const { subjectId, examName, totalQuestions } = values;
    const selectedSubject = subjects.find(s => s.id === subjectId);
    if (!selectedSubject) return message.error('Vui lòng chọn môn học');

    // Lấy câu hỏi từ ngân hàng theo môn học
    const subjectQuestions = questions.filter(q => q.subjectId === subjectId);

    // Tính số lượng câu hỏi còn thiếu
    const remaining = totalQuestions - selectedQuestions.length;

    let finalQuestions = [...selectedQuestions];

    if (remaining > 0) {
      const randomQuestions = subjectQuestions
        .filter(q => !finalQuestions.some(fq => fq.id === q.id))
        .sort(() => 0.5 - Math.random())
        .slice(0, remaining);

      finalQuestions = [...finalQuestions, ...randomQuestions];
    }

    if (finalQuestions.length < totalQuestions) {
      return message.error('Không đủ câu hỏi trong ngân hàng');
    }

    const examStructure: ExamStructure = {
      id: `exam_${Date.now()}`,
      subjectId: subjectId,
      name: examName,
      questions: finalQuestions,
      questionDistribution: []
    };

    const updatedExams = [...exams, examStructure];
    setExams(updatedExams);
    LocalStorageService.saveItem('exams', updatedExams);

    message.success('Đã tạo đề thi thành công');
    setIsModalVisible(false);
    form.resetFields();
    setSelectedQuestions([]);
  };

  const columns = [
    {
      title: 'Mã Đề',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên Đề',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Môn Học',
      dataIndex: 'subjectId',
      key: 'subjectId',
      render: (subjectId: string) => subjects.find(s => s.id === subjectId)?.name || 'N/A',
    },
    {
      title: 'Số Câu Hỏi',
      key: 'questionCount',
      render: (record: ExamStructure) => record.questions.length,
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Tạo Đề Thi
      </Button>

      <Table columns={columns} dataSource={exams} rowKey="id" />

      <Modal
        title="Tạo Đề Thi"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleGenerate} layout="vertical">
          <Form.Item
            name="subjectId"
            label="Môn Học"
            rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
          >
            <Select placeholder="Chọn môn học">
              {subjects.map(subject => (
                <Option key={subject.id} value={subject.id}>{subject.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="examName"
            label="Tên Đề Thi"
            rules={[{ required: true, message: 'Vui lòng nhập tên đề thi' }]}
          >
            <Input placeholder="Nhập tên đề thi" />
          </Form.Item>

          <Form.Item
            name="totalQuestions"
            label="Tổng số câu hỏi"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng câu hỏi' }]}
          >
            <InputNumber min={1} placeholder="Nhập tổng số câu hỏi" style={{ width: '100%' }} />
          </Form.Item>

          <Input.Search
            placeholder="Nhập ID câu hỏi để thêm"
            enterButton="Thêm"
            onSearch={handleAddQuestionById}
            style={{ marginBottom: 16 }}
          />

          <Table
            dataSource={selectedQuestions}
            columns={[{ title: 'Nội dung', dataIndex: 'content', key: 'content' }]}
            rowKey="id"
            size="small"
          />
        </Form>
      </Modal>
    </div>
  );
}

export default ExamGenerator;
