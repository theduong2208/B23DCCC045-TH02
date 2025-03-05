import { ExamStructure, Question } from "@/interfaces/types";

// services/examService.ts
export class ExamService {
  static getRandomQuestions(availableQuestions: Question[], remainingCount: number, selectedQuestions: any) {
    throw new Error('Method not implemented.');
  }

  static generateExam(structure: ExamStructure, questions: Question[]): Question[] {
    const selectedQuestions: Question[] = [];

    structure.questionDistribution.forEach(dist => {
      const filteredQuestions = questions.filter(q =>
        q.difficulty === dist.difficulty &&
        (!dist.knowledgeDomain || q.knowledgeDomain === dist.knowledgeDomain)
      );

      const selectedForDifficulty = this.selectRandomQuestions(
        filteredQuestions,
        dist.count
      );

      selectedQuestions.push(...selectedForDifficulty);
    });

    return selectedQuestions;
  }


  private static selectRandomQuestions(questions: Question[], count: number): Question[] {
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questions.length));
  }
}

