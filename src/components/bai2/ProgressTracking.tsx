import React, { useState, useEffect } from 'react';
import { Card, Select, Form, DatePicker, TimePicker, Input, Button, Table, Space, Popconfirm, Modal, message, Badge, Calendar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import './ProgressTracking.css';
import ScheduleCalendar from './ScheduleCalendar';

interface StudySession {
  id: string;
  subjectId: string;
  date: string;
  duration: string;
  content: string;
  notes?: string;
}

const ProgressTracking: React.FC = () => {
  const [form] = Form.useForm();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isScheduleVisible, setIsScheduleVisible] = useState(false);

  useEffect(() => {
    const savedSessions = localStorage.getItem('studySessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('studySessions', JSON.stringify(sessions));
  }, [sessions]);

  const showModal = (record?: StudySession) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        ...record,
        date: moment(record.date),
        duration: moment(record.duration, 'HH:mm'),
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingId(null);
    form.resetFields();
  };

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      date: values.date.format('YYYY-MM-DD HH:mm:ss'),
      duration: values.duration.format('HH:mm'),
    };

    if (editingId) {
      setSessions(sessions.map(session =>
        session.id === editingId
          ? { ...formattedValues, id: editingId }
          : session
      ));
      message.success('Cập nhật buổi học thành công!');
    } else {
      const newSession = {
        ...formattedValues,
        id: Date.now().toString(),
      };
      setSessions([...sessions, newSession]);
      message.success('Thêm buổi học mới thành công!');
    }

    setIsModalVisible(false);
    setEditingId(null);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    setSessions(sessions.filter(session => session.id !== id));
    message.success('Xóa buổi học thành công!');
  };

  const getListData = (value: moment.Moment) => {
    const dateString = value.format('YYYY-MM-DD');
    return sessions
      .filter(session => session.date.startsWith(dateString))
      .map(session => ({
        type: 'success',
        content: session.subjectId, // Chỉ hiển thị tên môn học
      }));
  };

  const dateCellRender = (value: moment.Moment) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card title="Theo dõi Tiến độ Học tập">
      <Calendar dateCellRender={dateCellRender} />

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal()}
        style={{ marginBottom: 16 }}
      >
        Tạo buổi học mới
      </Button>
      <Button style={{ marginLeft: 8 }} onClick={() => setIsScheduleVisible(true)}>
        Xem thời khóa biểu
      </Button>

      <Table
        columns={[
          { title: 'Môn học', dataIndex: 'subjectId', key: 'subjectId' },
          { title: 'Ngày học', dataIndex: 'date', key: 'date' },
          { title: 'Thời lượng', dataIndex: 'duration', key: 'duration' },
          { title: 'Nội dung đã học', dataIndex: 'content', key: 'content' },
          { title: 'Ghi chú', dataIndex: 'notes', key: 'notes' },
          {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: StudySession) => (
              <Space>
                <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
                <Popconfirm title="Bạn có chắc muốn xóa buổi học này?" onConfirm={() => handleDelete(record.id)}>
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            ),
          },
        ]}
        dataSource={sessions}
        rowKey="id"
      />

      <Modal title={editingId ? "Cập nhật buổi học" : "Tạo buổi học mới"} visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="subjectId" label="Môn học" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item name="date" label="Ngày học" rules={[{ required: true }]}> <DatePicker showTime format="DD/MM/YYYY HH:mm" /> </Form.Item>
          <Form.Item name="duration" label="Thời lượng học" rules={[{ required: true }]}> <TimePicker format="HH:mm" /> </Form.Item>
          <Form.Item name="content" label="Nội dung đã học" rules={[{ required: true }]}> <Input.TextArea /> </Form.Item>
          <Form.Item name="notes" label="Ghi chú"> <Input.TextArea /> </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">{editingId ? 'Cập nhật' : 'Tạo mới'}</Button>
              <Button onClick={handleCancel}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
      title="Thời khóa biểu"
      visible={isScheduleVisible}
      onCancel={() => setIsScheduleVisible(false)}
      footer={null}
    >
      <ScheduleCalendar sessions={sessions} />
    </Modal>


    </Card>
  );
};

export default ProgressTracking;
