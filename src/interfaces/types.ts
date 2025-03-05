export interface Subject {
	id: string;
	name: string;
	credits: number;
	knowledgeDomains: string[];
}

export interface Question {
	answer: any;
	id: string;
	subjectId: string;
	content: string;
	difficulty: 'Easy' | 'Medium' | 'Hard' | 'VeryHard';
	knowledgeDomain: string;
}

export interface ExamStructure {
	id: string;
	subjectId: string;
	name: string;
	questionDistribution: {
		difficulty: 'Easy' | 'Medium' | 'Hard' | 'VeryHard';
		count: number;
		knowledgeDomain?: string;
	}[];
	questions: Question[];
}
interface ExamDetailModalProps {
	visible: boolean;
	exam: ExamStructure | null;
	subjects: Subject[];
	onClose: () => void;
}
