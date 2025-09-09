export interface Flashcard {
  id: number;
  question: string;
  answer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type AppMode = 'study' | 'quiz';

export interface QuizResult {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
  timeTaken: number;
}

export interface QuizSession {
  totalQuestions: number;
  correctAnswers: number;
  totalTime: number;
  results: QuizResult[];
  category: string;
  completedAt: Date;
}

export interface UserProgress {
  category: string;
  totalAttempts: number;
  correctAnswers: number;
  averageScore: number;
  lastAttempt: Date;
  strongTopics: string[];
  weakTopics: string[];
  recommendedDifficulty: 'easy' | 'medium' | 'hard';
}

export interface LearningPath {
  category: string;
  currentLevel: number;
  unlockedQuestions: number[];
  masteredQuestions: number[];
  strugglingQuestions: number[];
}

export interface AdaptiveQuestion {
  baseQuestion: QuizQuestion | Flashcard;
  unlockConditions: {
    category: string;
    minScore: number;
    prerequisiteQuestions?: number[];
  };
  isUnlocked: boolean;
}
