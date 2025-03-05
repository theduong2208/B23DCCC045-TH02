import React, { useState, useEffect } from 'react';
import { Form, Select, Input, InputNumber, Button, Table, message } from 'antd';
import { ExamStructure, Subject, Question } from '../../interfaces/types';

const { Option } = Select;

interface ExamFormProps {
	subjects: Subject[];
	questions: Question[];
	initialExam?: ExamStructure | null;
	onSave: (examData: ExamStructure) => void;
	onCancel: () => void;
}

const ExamForm: React.FC<ExamFormProps> = ({ subjects, questions, initialExam, onSave, onCancel }) => {
	const [form] = Form.useForm();
	const [selectedQuestions, setSelectedQuestions] = useState<Question[]>(initialExam?.questions || []);

	useEffect(() => {
		if (initialExam) {
			form.setFieldsValue({
				subjectId: initialExam.subjectId,
				examName: initialExam.name,
				easyQuestions: initialExam.questionDistribution.find((d) => d.difficulty === 'Easy')?.count || 0,
				mediumQuestions: initialExam.questionDistribution.find((d) => d.difficulty === 'Medium')?.count || 0,
				hardQuestions: initialExam.questionDistribution.find((d) => d.difficulty === 'Hard')?.count || 0,
				veryHardQuestions: initialExam.questionDistribution.find((d) => d.difficulty === 'VeryHard')?.count || 0,
			});
		}
	}, [initialExam, form]);

	const handleAddQuestionById = (id: string) => {
		const question = questions.find((q) => q.id === id);
		if (question) {
			if (!selectedQuestions.find((q) => q.id === id)) {
				setSelectedQuestions((prev) => [...prev, question]);
				message.success('Đã thêm câu hỏi vào đề thi');
			} else {
				message.warning('Câu hỏi đã tồn tại trong danh sách');
			}
		} else {
			message.error('Không tìm thấy câu hỏi với ID này');
		}
	};

	const handleGenerate = (values: any) => {
		const { subjectId, examName, easyQuestions, mediumQuestions, hardQuestions, veryHardQuestions, knowledgeDomain } =
			values;

		const selectedSubject = subjects.find((s) => s.id === subjectId);
		if (!selectedSubject) return message.error('Vui lòng chọn môn học');

		// Lấy câu hỏi từ ngân hàng theo môn học và mức độ
		const subjectQuestions = questions.filter(
			(q) => q.subjectId === subjectId && (!knowledgeDomain || q.knowledgeDomain === knowledgeDomain),
		);

		// Phân loại câu hỏi theo mức độ
		const questionsByDifficulty = {
			Easy: subjectQuestions.filter((q) => q.difficulty === 'Easy'),
			Medium: subjectQuestions.filter((q) => q.difficulty === 'Medium'),
			Hard: subjectQuestions.filter((q) => q.difficulty === 'Hard'),
			VeryHard: subjectQuestions.filter((q) => q.difficulty === 'VeryHard'),
		};

		// Kiểm tra số lượng câu hỏi đủ không
		const totalRequestedQuestions = easyQuestions + mediumQuestions + hardQuestions + veryHardQuestions;

		let finalQuestions: Question[] = [...selectedQuestions];

		// Hàm lấy câu hỏi ngẫu nhiên theo mức độ
		const getRandomQuestions = (difficulty: string, count: number) => {
			const availableQuestions = questionsByDifficulty[difficulty as keyof typeof questionsByDifficulty]
				.filter((q) => !finalQuestions.some((fq) => fq.id === q.id))
				.sort(() => 0.5 - Math.random())
				.slice(0, count);
			return availableQuestions;
		};

		// Thêm câu hỏi ngẫu nhiên theo từng mức độ
		const addRandomQuestions = (difficulty: string, count: number) => {
			const randomQuestions = getRandomQuestions(difficulty, count);
			if (randomQuestions.length < count) {
				message.warning(`Không đủ câu hỏi ${difficulty}`);
			}
			finalQuestions = [...finalQuestions, ...randomQuestions];
		};

		// Thêm câu hỏi theo mức độ
		addRandomQuestions('Easy', easyQuestions);
		addRandomQuestions('Medium', mediumQuestions);
		addRandomQuestions('Hard', hardQuestions);
		addRandomQuestions('VeryHard', veryHardQuestions);

		if (finalQuestions.length < totalRequestedQuestions) {
			return message.error('Không đủ câu hỏi trong ngân hàng');
		}

		const examStructure: ExamStructure = {
			id: initialExam?.id || `exam_${Date.now()}`,
			subjectId: subjectId,
			name: examName,
			questions: finalQuestions,
			questionDistribution: [
				{ difficulty: 'Easy', count: easyQuestions },
				{ difficulty: 'Medium', count: mediumQuestions },
				{ difficulty: 'Hard', count: hardQuestions },
				{ difficulty: 'VeryHard', count: veryHardQuestions },
			],
		};

		onSave(examStructure);
	};

	const columns = [
		{
			title: 'Nội dung',
			dataIndex: 'content',
			key: 'content',
		},
		{
			title: 'Độ Khó',
			dataIndex: 'difficulty',
			key: 'difficulty',
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
			title: 'Hành Động',
			key: 'actions',
			render: (text: any, record: Question) => (
				<Button
					type='link'
					danger
					onClick={() => {
						setSelectedQuestions((prev) => prev.filter((q) => q.id !== record.id));
					}}
				>
					Xóa
				</Button>
			),
		},
	];

	return (
		<Form form={form} onFinish={handleGenerate} layout='vertical'>
			<Form.Item name='subjectId' label='Môn Học' rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}>
				<Select
					placeholder='Chọn môn học'
					onChange={(value) => {
						// Tìm môn học được chọn
						const selectedSubject = subjects.find((subject) => subject.id === value);

						// Nếu môn học có khối kiến thức, tự động điền
						if (selectedSubject && selectedSubject.knowledgeDomains && selectedSubject.knowledgeDomains.length > 0) {
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

			<Form.Item name='examName' label='Tên Đề Thi' rules={[{ required: true, message: 'Vui lòng nhập tên đề thi' }]}>
				<Input placeholder='Nhập tên đề thi' />
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

			<Form.Item label='Phân Phối Câu Hỏi Theo Mức Độ'>
				<Form.Item
					name='easyQuestions'
					label='Số Câu Dễ'
					rules={[{ required: true, message: 'Vui lòng nhập số câu dễ' }]}
				>
					<InputNumber min={0} placeholder='Số câu dễ' style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item
					name='mediumQuestions'
					label='Số Câu Trung Bình'
					rules={[{ required: true, message: 'Vui lòng nhập số câu trung bình' }]}
				>
					<InputNumber min={0} placeholder='Số câu trung bình' style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item
					name='hardQuestions'
					label='Số Câu Khó'
					rules={[{ required: true, message: 'Vui lòng nhập số câu khó' }]}
				>
					<InputNumber min={0} placeholder='Số câu khó' style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='veryHardQuestions' label='Số Câu Rất Khó'>
					<InputNumber min={0} placeholder='Số câu rất khó' style={{ width: '100%' }} />
				</Form.Item>
			</Form.Item>

			<Input.Search
				placeholder='Nhập ID câu hỏi để thêm'
				enterButton='Thêm'
				onSearch={handleAddQuestionById}
				style={{ marginBottom: 16 }}
			/>

			<Table
				dataSource={selectedQuestions}
				columns={columns}
				rowKey='id'
				pagination={{
					pageSize: 5,
					showSizeChanger: true,
					pageSizeOptions: ['5', '10', '15'],
				}}
			/>

			<Form.Item style={{ marginTop: 16, textAlign: 'right' }}>
				<Button onClick={onCancel} style={{ marginRight: 8 }}>
					Hủy
				</Button>
				<Button type='primary' htmlType='submit'>
					{initialExam ? 'Cập Nhật' : 'Tạo Đề'}
				</Button>
			</Form.Item>
		</Form>
	);
};

export default ExamForm;
