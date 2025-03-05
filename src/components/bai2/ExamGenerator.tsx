import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Typography } from 'antd';
import { ExamStructure, Subject, Question } from '../../interfaces/types';
import { LocalStorageService } from '../../services/bai2/localStorageService';
import ExamForm from './ExamForm';
import ExamDetailModal from './ExamDetailModal'; // Import the new modal
import form from 'antd/lib/form';

function ExamGenerator() {
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [questions, setQuestions] = useState<Question[]>([]);
	const [exams, setExams] = useState<ExamStructure[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isDetailModalVisible, setIsDetailModalVisible] = useState(false); // New state
	const [currentExam, setCurrentExam] = useState<ExamStructure | null>(null);
	const [selectedExamForDetail, setSelectedExamForDetail] = useState<ExamStructure | null>(null); // New state

	useEffect(() => {
		setSubjects(LocalStorageService.getItem<Subject[]>('subjects') || []);
		setQuestions(LocalStorageService.getItem<Question[]>('questions') || []);
		setExams(LocalStorageService.getItem<ExamStructure[]>('exams') || []);
	}, []);

	const handleSaveExam = (examData: ExamStructure) => {
		let updatedExams;
		if (currentExam) {
			// Chỉnh sửa đề thi
			updatedExams = exams.map((exam) => (exam.id === currentExam.id ? examData : exam));
			message.success('Đã cập nhật đề thi');
		} else {
			// Thêm mới đề thi
			updatedExams = [...exams, examData];
			message.success('Đã tạo đề thi thành công');
		}

		setExams(updatedExams);
		LocalStorageService.saveItem('exams', updatedExams);
		setIsModalVisible(false);
		setCurrentExam(null);
	};

	const handleDelete = (id: string) => {
		const updatedExams = exams.filter((exam) => exam.id !== id);
		setExams(updatedExams);
		LocalStorageService.saveItem('exams', updatedExams);
		message.success('Đã xóa đề thi');
	};

	const handleEdit = (exam: ExamStructure) => {
		setCurrentExam(exam);
		setIsModalVisible(true);
	};

	const handleViewDetail = (exam: ExamStructure) => {
		setSelectedExamForDetail(exam);
		setIsDetailModalVisible(true);
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
			render: (subjectId: string) => subjects.find((s) => s.id === subjectId)?.name || 'N/A',
		},
		{
			title: 'Số Câu Hỏi',
			key: 'questionCount',
			render: (record: ExamStructure) => record.questions.length,
		},
		{
			title: 'Phân Phối Mức Độ',
			key: 'difficultyDistribution',
			render: (record: ExamStructure) => {
				const distribution = record.questionDistribution || [];
				return distribution.map((d) => `${d.difficulty}: ${d.count}`).join(', ');
			},
		},
		{
			title: 'Hành Động',
			key: 'actions',
			render: (text: any, record: ExamStructure) => (
				<div>
					<Button type='link' onClick={() => handleViewDetail(record)}>
						Xem Chi Tiết
					</Button>
					<Button type='link' onClick={() => handleEdit(record)}>
						Sửa
					</Button>
					<Button type='link' danger onClick={() => handleDelete(record.id)}>
						Xóa
					</Button>
				</div>
			),
		},
	];

	return (
		<div>
			<Button type='primary' onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
				Tạo Đề Thi
			</Button>

			<Table
				columns={columns}
				dataSource={exams}
				rowKey='id'
				pagination={{
					pageSize: 10,
					showSizeChanger: true,
					pageSizeOptions: ['10', '20', '50'],
				}}
			/>

			<Modal
				title={currentExam ? 'Chỉnh Sửa Đề Thi' : 'Tạo Đề Thi'}
				visible={isModalVisible}
				footer={null}
				onCancel={() => {
					setIsModalVisible(false);
					setCurrentExam(null);
				}}
				width={700}
			>
				<ExamForm
					subjects={subjects}
					questions={questions}
					initialExam={currentExam}
					onSave={handleSaveExam}
					onCancel={() => {
						setIsModalVisible(false);
						setCurrentExam(null);
					}}
				/>
			</Modal>

			{/* Modal chi tiết đề thi */}
			<ExamDetailModal
				visible={isDetailModalVisible}
				exam={selectedExamForDetail}
				subjects={subjects}
				onClose={() => {
					setIsDetailModalVisible(false);
					setSelectedExamForDetail(null);
				}}
			/>
		</div>
	);
}

export default ExamGenerator;
