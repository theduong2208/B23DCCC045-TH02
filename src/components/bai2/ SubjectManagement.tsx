import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, AutoComplete } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const defaultSubjects = ['Toán', 'Văn', 'Anh', 'Khoa học', 'Công nghệ'];

const SubjectManagement: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const savedSubjects = localStorage.getItem('subjects');
    return savedSubjects ? JSON.parse(savedSubjects) : [];
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Subject) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    const updatedSubjects = subjects.filter(subject => subject.id !== id);
    setSubjects(updatedSubjects);
  };

  const handleSubmit = (values: any) => {
    const existingSubject = subjects.find(subject => subject.name === values.name);
    if (existingSubject && !editingId) {
      alert('Tên môn học đã tồn tại!');
      return;
    }

    if (editingId) {
      setSubjects(subjects.map(subject => subject.id === editingId ? { ...subject, ...values } : subject));
    } else {
      setSubjects([...subjects, { ...values, id: Date.now().toString() }]);
    }
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} className="mb-4">
        Thêm môn học
      </Button>

      <Table columns={[
        {
          title: 'Tên môn học',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Thao tác',
          key: 'action',
          render: (_: any, record: Subject) => (
            <Space>
              <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
              <Popconfirm title="Bạn có chắc muốn xóa môn học này?" onConfirm={() => handleDelete(record.id)}>
                <Button danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          ),
        },
      ]} dataSource={subjects} rowKey="id" />

      <Modal
        title={editingId ? "Sửa môn học" : "Thêm môn học mới"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
  name="name"
  label="Tên môn học"
  rules={[
    { required: true, message: 'Vui lòng nhập tên môn học!' },
    {
      pattern: /^[\p{L}\d\s]+$/u,
      message: 'Tên môn học chỉ được chứa chữ cái, số và khoảng trắng!'
    }
  ]}
>
  <AutoComplete
    options={defaultSubjects
      .filter(subject => subject.toLowerCase().includes(searchText.toLowerCase()))
      .map(subject => ({ value: subject }))}
    onSearch={setSearchText}
    placeholder="Nhập tên môn học"
  >
    <Input />
  </AutoComplete>
</Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingId ? "Cập nhật" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SubjectManagement;
