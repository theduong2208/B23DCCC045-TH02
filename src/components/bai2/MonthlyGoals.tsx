import React, { useState, useEffect } from 'react';
import { Card, Progress, Table, Form, InputNumber, Input, Button, Row, Col, Statistic, Modal, message } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { AutoComplete } from 'antd';
const vietnameseRegex = /^(?!\d+$)[\p{L}0-9\s]+$/u;

interface Subject {
  id: string;
  name: string;
}

interface Goal {
  subjectId: string;
  target: number;
  completed: number;
}

const MonthlyGoals: React.FC = () => {
  const [goals, setGoals] = useState<{ [key: string]: Goal }>(() => {
    const storedGoals = localStorage.getItem('monthlyGoals');
    return storedGoals ? JSON.parse(storedGoals) : {};
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const storedSubjects = localStorage.getItem('subjects');
    return storedSubjects ? JSON.parse(storedSubjects) : [
      { id: 'math', name: 'Toán' },
      { id: 'literature', name: 'Văn' },
      { id: 'english', name: 'Tiếng Anh' },
      { id: 'physics', name: 'Vật lý' },
      { id: 'chemistry', name: 'Hóa học' },
    ];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newTarget, setNewTarget] = useState(0);
  const [newCompleted, setNewCompleted] = useState(0);

  useEffect(() => {
    localStorage.setItem('monthlyGoals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  const updateGoals = (subjectId: string, updates: Partial<Goal>) => {
    setGoals(prev => {
      const updatedGoals = { ...prev, [subjectId]: { ...prev[subjectId], ...updates } };
      localStorage.setItem('monthlyGoals', JSON.stringify(updatedGoals));
      return updatedGoals;
    });
  };

  const handleAddSubject = () => {
    const trimmedSubject = newSubject.trim();

    if (!vietnameseRegex.test(trimmedSubject)) {
      return message.error("Tên môn học không hợp lệ! Không nhập toàn số hoặc ký tự đặc biệt.");
    }

    if (subjects.some(subject => subject.name.toLowerCase() === trimmedSubject.toLowerCase())) {
      return message.error("Môn học này đã tồn tại!");
    }

    if (newTarget <= 0) {
      return message.error("Mục tiêu phải lớn hơn 0!");
    }

    if (newCompleted < 0 || newCompleted > newTarget) {
      return message.error("Số giờ đã học phải trong khoảng từ 0 đến mục tiêu!");
    }

    const newId = trimmedSubject.toLowerCase().replace(/\s+/g, '-');
    setSubjects(prev => [...prev, { id: newId, name: trimmedSubject }]);
    updateGoals(newId, { subjectId: newId, target: newTarget, completed: newCompleted });

    setIsAdding(false);
    setNewSubject('');
    setNewTarget(0);
    setNewCompleted(0);
  };




  const handleDelete = (subjectId: string) => {
    setSubjects(prev => {
      const updatedSubjects = prev.filter(subject => subject.id !== subjectId);
      localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
      return updatedSubjects;
    });

    setGoals(prev => {
      const updatedGoals = { ...prev };
      delete updatedGoals[subjectId];
      localStorage.setItem('monthlyGoals', JSON.stringify(updatedGoals));
      return updatedGoals;
    });
  };

  const totalProgress = Object.values(goals).reduce(
    (acc, goal) => ({
      target: acc.target + (goal.target || 0),
      completed: acc.completed + (goal.completed || 0),
    }),
    { target: 0, completed: 0 }
  );

  const progressPercentage = totalProgress.target ? (totalProgress.completed / totalProgress.target) * 100 : 0;

  const columns = [
    { title: 'Môn học', dataIndex: 'name', key: 'name' },
    {
      title: 'Mục tiêu (giờ/tháng)',
      dataIndex: 'target',
      key: 'target',
      render: (_: any, record: Subject) => (
        <InputNumber
          min={0}
          value={goals[record.id]?.target || 0}
          onChange={(value) => updateGoals(record.id, { target: value || 0 })}
        />
      ),
    },
    {
      title: 'Đã học (giờ)',
      dataIndex: 'completed',
      key: 'completed',
      render: (_: any, record: Subject) => (
        <InputNumber
          min={0}
          max={goals[record.id]?.target || 0}
          value={goals[record.id]?.completed || 0}
          onChange={(value) => updateGoals(record.id, { completed: value || 0 })}
        />
      ),
    },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      key: 'progress',
      render: (_: any, record: Subject) => (
        <Progress percent={Math.min(100, (goals[record.id]?.completed / goals[record.id]?.target) * 100 || 0)} />
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Subject) => (
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="Tổng số giờ mục tiêu" value={totalProgress.target} suffix="giờ" prefix={<ClockCircleOutlined />} />
          </Col>
          <Col span={8}>
            <Statistic title="Đã hoàn thành" value={totalProgress.completed} suffix="giờ" prefix={<CheckCircleOutlined />} />
          </Col>
          <Col span={8}>
            <Statistic title="Tiến độ tổng thể" value={progressPercentage.toFixed(1)} suffix="%" />
          </Col>
        </Row>
      </Card>

      <Card title="Mục tiêu học tập tháng" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAdding(true)}>Thêm môn</Button>}>
        <Table columns={columns} dataSource={subjects} rowKey="id" pagination={false} />
      </Card>

      <Modal
  title="Thêm môn học mới"
  visible={isAdding}
  onCancel={() => setIsAdding(false)}
  onOk={handleAddSubject}
>
  <Form layout="vertical">
    {/* Nhập tên môn học */}
    <Form.Item label="Tên môn học" required>
      <AutoComplete
        options={subjects.map(subject => ({ value: subject.name }))}
        style={{ width: "100%" }}
        placeholder="Nhập tên môn học"
        value={newSubject}
        onChange={setNewSubject}
        filterOption={(inputValue, option) =>
          option!.value.toLowerCase().includes(inputValue.toLowerCase())
        }
      />
    </Form.Item>

    {/* Nhập mục tiêu (giờ/tháng) */}
      <Form.Item label="Mục tiêu (giờ/tháng)" required>
        <InputNumber
          min={1}
          value={newTarget}
          onChange={value => setNewTarget(value || 0)}
          style={{ width: "100%" }}
          placeholder="Nhập số giờ mục tiêu"
        />
      </Form.Item>

      {/* Nhập số giờ đã học */}
      <Form.Item label="Đã học (giờ)" required>
        <InputNumber
          min={0}
          max={newTarget}
          value={newCompleted}
          onChange={value => setNewCompleted(value || 0)}
          style={{ width: "100%" }}
          placeholder="Nhập số giờ đã học"
        />
      </Form.Item>
    </Form>
  </Modal>

    </div>
  );
};

export default MonthlyGoals;
