import React from 'react';
import { Modal, Table, Tag, Typography } from 'antd';
import { ExamDetailModalProps } from '@/interfaces/types';

const { Text } = Typography;

const ExamDetailModal: React.FC<ExamDetailModalProps> = ({ visible, exam, subjects, onClose }) => {
	if (!exam) return null;

	const subject = subjects.find((s) => s.id === exam.subjectId);

	const columns = [
		{
			title: 'STT',
			dataIndex: 'index',
			key: 'index',
			render: (text: any, record: any, index: number) => index + 1,
		},
		{
			title: 'Nội Dung Câu Hỏi',
			dataIndex: 'content',
			key: 'content',
			render: (text: string) => <Text ellipsis={{ tooltip: text }}>{text}</Text>,
		},
		{
			title: 'Độ Khó',
			dataIndex: 'difficulty',
			key: 'difficulty',
			render: (difficulty: string) => {
				const difficultyMap = {
					Easy: { text: 'Dễ', color: 'green' },
					Medium: { text: 'Trung Bình', color: 'orange' },
					Hard: { text: 'Khó', color: 'red' },
					VeryHard: { text: 'Rất Khó', color: 'darkred' },
				};
				const difficultyInfo = difficultyMap[difficulty as keyof typeof difficultyMap] || {
					text: 'N/A',
					color: 'default',
				};
				return <Tag color={difficultyInfo.color}>{difficultyInfo.text}</Tag>;
			},
		},
		{
			title: 'Đáp Án',
			dataIndex: 'answer',
			key: 'answer',
			render: (answer: string) => <Text ellipsis={{ tooltip: answer }}>{answer}</Text>,
		},
	];
	const difficultyMap: Record<string, 'Easy' | 'Medium' | 'Hard'> = {
		Dễ: 'Easy',
		'Trung bình': 'Medium',
		Khó: 'Hard',
	};
	return (
		<Modal title={`Chi Tiết Đề Thi: ${exam.name}`} visible={visible} onCancel={onClose} footer={null} width={800}>
			<div style={{ marginBottom: 16 }}>
				<Text strong>Môn Học: </Text>
				<Text>{subject?.name || 'Không xác định'}</Text>
			</div>

			<div style={{ marginBottom: 16 }}>
				<Text strong>Phân Phối Độ Khó: </Text>
				{exam.questionDistribution?.map((dist) => {
					const mappedDifficulty = difficultyMap[dist.difficulty] || 'None'; // Mặc định nếu không khớp
					return (
						<Tag
							key={dist.difficulty}
							color={mappedDifficulty === 'Easy' ? 'green' : mappedDifficulty === 'Medium' ? 'orange' : 'red'}
						>
							{dist.difficulty}: {dist.count} câu
						</Tag>
					);
				})}
			</div>

			<Table
				columns={columns}
				dataSource={exam.questions}
				rowKey='id'
				pagination={{
					pageSize: 5,
					showSizeChanger: true,
					pageSizeOptions: ['5', '10', '15'],
				}}
			/>
		</Modal>
	);
};

export default ExamDetailModal;
