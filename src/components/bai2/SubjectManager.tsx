import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm } from 'antd';
import { Subject } from '../../interfaces/types';
import { LocalStorageService } from '../../services/bai2/localStorageService';

const { Option } = Select;

const SubjectManager: React.FC = () => {
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		const storedSubjects = LocalStorageService.getItem<Subject[]>('subjects') || [];
		setSubjects(storedSubjects);
	}, []);

	const handleAddSubject = (values: Omit<Subject, 'id'>) => {
		const newSubject = {
			...values,
			id: currentSubject ? currentSubject.id : `subj_${Date.now()}`,
			knowledgeDomains: values.knowledgeDomains || [],
		};

		let updatedSubjects;
		if (currentSubject) {
			// Chỉnh sửa môn học
			updatedSubjects = subjects.map((subject) => (subject.id === currentSubject.id ? newSubject : subject));
			message.success('Môn học đã được cập nhật');
		} else {
			// Thêm mới môn học
			updatedSubjects = [...subjects, newSubject];
			message.success('Môn học đã được thêm');
		}

		setSubjects(updatedSubjects);
		LocalStorageService.saveItem('subjects', updatedSubjects);

		setIsModalVisible(false);
		setCurrentSubject(null);
		form.resetFields();
	};

	const handleEdit = (subject: Subject) => {
		setCurrentSubject(subject);
		setIsModalVisible(true);
		form.setFieldsValue({
			name: subject.name,
			credits: subject.credits,
			knowledgeDomains: subject.knowledgeDomains,
		});
	};

	const handleDelete = (id: string) => {
		const updatedSubjects = subjects.filter((subject) => subject.id !== id);
		setSubjects(updatedSubjects);
		LocalStorageService.saveItem('subjects', updatedSubjects);
		message.success('Môn học đã được xóa');
	};

	const columns = [
		{
			title: 'Mã Môn',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'Tên Môn',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Số Tín Chỉ',
			dataIndex: 'credits',
			key: 'credits',
		},
		{
			title: 'Khối Kiến Thức',
			dataIndex: 'knowledgeDomains',
			key: 'knowledgeDomains',
			render: (domains: string[] | undefined) => domains?.join(', ') || 'Chưa xác định',
		},
		{
			title: 'Hành Động',
			key: 'actions',
			render: (text: any, record: Subject) => (
				<div>
					<Button type='link' onClick={() => handleEdit(record)}>
						Chỉnh Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa môn học này?'
						onConfirm={() => handleDelete(record.id)}
						okText='Có'
						cancelText='Không'
					>
						<Button type='link' danger>
							Xóa
						</Button>
					</Popconfirm>
				</div>
			),
		},
	];

	const handleModalOpen = () => {
		setCurrentSubject(null);
		form.resetFields();
		setIsModalVisible(true);
	};

	return (
		<div>
			<Button type='primary' onClick={handleModalOpen} style={{ marginBottom: 16 }}>
				Thêm Môn Học
			</Button>

			<Table columns={columns} dataSource={subjects} rowKey='id' />

			<Modal
				title={currentSubject ? 'Chỉnh Sửa Môn Học' : 'Thêm Môn Học'}
				visible={isModalVisible}
				onCancel={() => {
					setIsModalVisible(false);
					setCurrentSubject(null);
					form.resetFields();
				}}
				onOk={() => form.submit()}
			>
				<Form form={form} onFinish={handleAddSubject} layout='vertical'>
					<Form.Item name='name' label='Tên Môn Học' rules={[{ required: true, message: 'Vui lòng nhập tên môn học' }]}>
						<Input />
					</Form.Item>

					<Form.Item
						name='credits'
						label='Số Tín Chỉ'
						rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ' }]}
					>
						<Input type='number' />
					</Form.Item>

					<Form.Item
						name='knowledgeDomains'
						label='Khối Kiến Thức'
						rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức' }]}
					>
						<Select mode='multiple' placeholder='Chọn khối kiến thức'>
							<Option value='Đại Cương'>Đại Cương</Option>
							<Option value='Chuyên Ngành'>Chuyên Ngành</Option>
							<Option value='Tự Chọn'>Tự Chọn</Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default SubjectManager;
