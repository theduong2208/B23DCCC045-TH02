// Subject.ts
interface Subject {
  id: string;
  name: string;
  sessions: StudySession[];
  monthlyGoalHours: number;
}

interface StudySession {
  id: string;
  date: string;
  duration: number; // in minutes
  content: string;
  notes?: string;
}
