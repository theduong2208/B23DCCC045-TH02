import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Row, Col, Popconfirm, Typography } from 'antd';
import { Question, Subject } from '../../interfaces/types';
import { LocalStorageService } from '../../services/bai2/localStorageService';

const { Option } = Select;
const { Text } = Typography;

const QuestionBank: React.FC = () => {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
	const [searchFilters, setSearchFilters] = useState({
		subjectId: undefined,
		difficulty: undefined,
		knowledgeDomain: undefined,
	});
	const [form] = Form.useForm();

	useEffect(() => {
		const storedQuestions = LocalStorageService.getItem<Question[]>('questions') || [];
		const storedSubjects = LocalStorageService.getItem<Subject[]>('subjects') || [];
		setQuestions(storedQuestions);
		setFilteredQuestions(storedQuestions);
		setSubjects(storedSubjects);
	}, []);

	// Lọc câu hỏi dựa trên bộ lọc
	useEffect(() => {
		const filtered = questions.filter((question) => {
			const matchSubject = !searchFilters.subjectId || question.subjectId === searchFilters.subjectId;
			const matchDifficulty = !searchFilters.difficulty || question.difficulty === searchFilters.difficulty;
			const matchDomain = !searchFilters.knowledgeDomain || question.knowledgeDomain === searchFilters.knowledgeDomain;

			return matchSubject && matchDifficulty && matchDomain;
		});

		setFilteredQuestions(filtered);
	}, [searchFilters, questions]);

	const handleAddQuestion = (values: Omit<Question, 'id'>) => {
		const newQuestion = {
			...values,
			id: currentQuestion ? currentQuestion.id : `ques_${Date.now()}`,
		};

		let updatedQuestions;
		if (currentQuestion) {
			// Chỉnh sửa câu hỏi
			updatedQuestions = questions.map((q) => (q.id === currentQuestion.id ? newQuestion : q));
			message.success('Câu hỏi đã được cập nhật');
		} else {
			// Thêm mới câu hỏi
			updatedQuestions = [...questions, newQuestion];
			message.success('Câu hỏi đã được thêm');
		}

		setQuestions(updatedQuestions);
		LocalStorageService.saveItem('questions', updatedQuestions);

		setIsModalVisible(false);
		setCurrentQuestion(null);
		form.resetFields();
	};

	const handleEdit = (question: Question) => {
		setCurrentQuestion(question);
		setIsModalVisible(true);
		form.setFieldsValue({
			subjectId: question.subjectId,
			content: question.content,
			difficulty: question.difficulty,
			knowledgeDomain: question.knowledgeDomain,
			answer: question.answer,
		});
	};

	const handleDelete = (id: string) => {
		const updatedQuestions = questions.filter((q) => q.id !== id);
		setQuestions(updatedQuestions);
		LocalStorageService.saveItem('questions', updatedQuestions);
		message.success('Câu hỏi đã được xóa');
	};

	const columns = [
		{
			title: 'Mã Câu Hỏi',
			dataIndex: 'id',
			key: 'id',
			width: 120,
		},
		{
			title: 'Môn Học',
			dataIndex: 'subjectId',
			key: 'subjectId',
			render: (subjectId: string) => {
				const subject = subjects.find((s) => s.id === subjectId);
				return subject ? subject.name : 'N/A';
			},
			width: 150,
		},
		{
			title: 'Nội Dung',
			dataIndex: 'content',
			key: 'content',
			ellipsis: true,
		},
		{
			title: 'Độ Khó',
			dataIndex: 'difficulty',
			key: 'difficulty',
			width: 120,
			render: (difficulty: string) => {
				const difficultyMap = {
					Easy: 'Dễ',
					Medium: 'Trung Bình',
					Hard: 'Khó',
					VeryHard: 'Rất Khó',
				};
				return difficultyMap[difficulty as keyof typeof difficultyMap];
			},
		},
		{
			title: 'Khối Kiến Thức',
			dataIndex: 'knowledgeDomain',
			key: 'knowledgeDomain',
			width: 150,
		},
		{
			title: 'Hành Động',
			key: 'actions',
			width: 150,
			render: (text: any, record: Question) => (
				<div>
					<Button
						type='link'
						onClick={() => {
							Modal.info({
								title: 'Chi Tiết Câu Hỏi',
								content: (
									<div>
										<p>
											<Text strong>Nội Dung:</Text> {record.content}
										</p>
										<p>
											<Text strong>Đáp Án:</Text> {record.answer || 'Chưa có đáp án'}
										</p>
									</div>
								),
								width: 600,
							});
						}}
					>
						Xem
					</Button>
					<Button type='link' onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc chắn muốn xóa câu hỏi này?'
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

	return (
		<div>
			{/* Thanh tìm kiếm và lọc */}
			<Row gutter={16} style={{ marginBottom: 16 }}>
				<Col span={6}>
					<Select
						style={{ width: '100%' }}
						placeholder='Lọc theo Môn Học'
						allowClear
						onChange={(value) =>
							setSearchFilters((prev) => ({
								...prev,
								subjectId: value,
							}))
						}
					>
						{subjects.map((subject) => (
							<Option key={subject.id} value={subject.id}>
								{subject.name}
							</Option>
						))}
					</Select>
				</Col>
				<Col span={6}>
					<Select
						style={{ width: '100%' }}
						placeholder='Lọc theo Độ Khó'
						allowClear
						onChange={(value) =>
							setSearchFilters((prev) => ({
								...prev,
								difficulty: value,
							}))
						}
					>
						<Option value='Easy'>Dễ</Option>
						<Option value='Medium'>Trung Bình</Option>
						<Option value='Hard'>Khó</Option>
						<Option value='VeryHard'>Rất Khó</Option>
					</Select>
				</Col>
				<Col span={6}>
					<Select
						style={{ width: '100%' }}
						placeholder='Lọc theo Khối Kiến Thức'
						allowClear
						onChange={(value) =>
							setSearchFilters((prev) => ({
								...prev,
								knowledgeDomain: value,
							}))
						}
					>
						{subjects.flatMap((subject) =>
							subject.knowledgeDomains.map((domain) => (
								<Option key={`${subject.id}-${domain}`} value={domain}>
									{domain}
								</Option>
							)),
						)}
					</Select>
				</Col>
				<Col span={6}>
					<Button type='primary' onClick={() => setIsModalVisible(true)}>
						Thêm Câu Hỏi
					</Button>
				</Col>
			</Row>

			<Table
				columns={columns}
				dataSource={filteredQuestions}
				rowKey='id'
				pagination={{
					pageSize: 10,
					showSizeChanger: true,
					pageSizeOptions: ['10', '20', '50'],
				}}
			/>

			<Modal
				title={currentQuestion ? 'Chỉnh Sửa Câu Hỏi' : 'Thêm Câu Hỏi'}
				visible={isModalVisible}
				onCancel={() => {
					setIsModalVisible(false);
					setCurrentQuestion(null);
					form.resetFields();
				}}
				onOk={() => form.submit()}
			>
				<Form form={form} onFinish={handleAddQuestion} layout='vertical'>
					<Form.Item name='subjectId' label='Môn Học' rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}>
						<Select
							placeholder='Chọn môn học'
							onChange={(value) => {
								// Tìm môn học được chọn
								const selectedSubject = subjects.find((subject) => subject.id === value);

								// Nếu môn học có khối kiến thức, tự động điền
								if (
									selectedSubject &&
									selectedSubject.knowledgeDomains &&
									selectedSubject.knowledgeDomains.length > 0
								) {
									// Chọn khối kiến thức đầu tiên làm mặc định
									form.setFieldsValue({
										knowledgeDomain: selectedSubject.knowledgeDomains[0],
									});
								}
							}}
						>
							{subjects.map((subject) => (
								<Option key={subject.id} value={subject.id}>
									{subject.name}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item
						name='content'
						label='Nội Dung Câu Hỏi'
						rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}
					>
						<Input.TextArea rows={4} />
					</Form.Item>

					<Form.Item name='answer' label='Đáp Án' rules={[{ required: true, message: 'Vui lòng nhập đáp án' }]}>
						<Input.TextArea rows={3} />
					</Form.Item>

					<Form.Item name='difficulty' label='Độ Khó' rules={[{ required: true, message: 'Vui lòng chọn độ khó' }]}>
						<Select placeholder='Chọn độ khó'>
							<Option value='Easy'>Dễ</Option>
							<Option value='Medium'>Trung Bình</Option>
							<Option value='Hard'>Khó</Option>
							<Option value='VeryHard'>Rất Khó</Option>
						</Select>
					</Form.Item>

					<Form.Item
						name='knowledgeDomain'
						label='Khối Kiến Thức'
						rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức' }]}
					>
						<Select
							placeholder='Chọn khối kiến thức'
							// Lọc khối kiến thức dựa trên môn học đã chọn
							mode={false}
						>
							{subjects
								.find((subject) => subject.id === form.getFieldValue('subjectId'))
								?.knowledgeDomains.map((domain) => (
									<Option key={domain} value={domain}>
										{domain}
									</Option>
								)) || []}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default QuestionBank;
