import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Flashcard, QuizQuestion, QuizSession, UserProgress, LearningPath, AdaptiveQuestion } from '../types/flashcard.types';

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {
  private flashcardsSubject = new BehaviorSubject<Flashcard[]>([]);
  private quizQuestionsSubject = new BehaviorSubject<QuizQuestion[]>([]);
  private userProgressSubject = new BehaviorSubject<UserProgress[]>([]);
  private quizHistorySubject = new BehaviorSubject<QuizSession[]>([]);
  private learningPathsSubject = new BehaviorSubject<LearningPath[]>([]);

  flashcards$ = this.flashcardsSubject.asObservable();
  quizQuestions$ = this.quizQuestionsSubject.asObservable();
  userProgress$ = this.userProgressSubject.asObservable();
  quizHistory$ = this.quizHistorySubject.asObservable();
  learningPaths$ = this.learningPathsSubject.asObservable();

  constructor() {
    this.initializeData();
    this.loadProgress();
  }

  private initializeData(): void {
    const flashcards: Flashcard[] = [
      {
        id: 1,
        question: "What is the primary purpose of attention mechanisms in transformer models?",
        answer: "Attention mechanisms allow the model to focus on different parts of the input sequence when generating each output token, enabling better understanding of long-range dependencies and context.",
        category: "Transformers",
        difficulty: "medium"
      },
      {
        id: 2,
        question: "Explain the difference between supervised and unsupervised learning.",
        answer: "Supervised learning uses labeled training data to learn a mapping from inputs to outputs, while unsupervised learning finds patterns in data without labeled examples.",
        category: "Machine Learning Basics",
        difficulty: "easy"
      },
      {
        id: 3,
        question: "What is the vanishing gradient problem in deep neural networks?",
        answer: "The vanishing gradient problem occurs when gradients become exponentially smaller as they propagate backward through deep networks, making it difficult to train earlier layers effectively.",
        category: "Deep Learning",
        difficulty: "hard"
      },
      {
        id: 4,
        question: "Describe the role of embeddings in natural language processing.",
        answer: "Embeddings convert discrete tokens (words, characters, etc.) into dense vector representations that capture semantic relationships and can be processed by neural networks.",
        category: "NLP",
        difficulty: "medium"
      },
      {
        id: 5,
        question: "What is the purpose of regularization in machine learning?",
        answer: "Regularization techniques prevent overfitting by adding constraints or penalties to the model, helping it generalize better to unseen data.",
        category: "Machine Learning Basics",
        difficulty: "easy"
      },
      // Advanced questions that unlock based on progress
      {
        id: 6,
        question: "Explain the concept of self-attention in transformer architectures.",
        answer: "Self-attention allows each position in a sequence to attend to all positions in the same sequence, enabling the model to capture dependencies regardless of their distance in the sequence.",
        category: "Transformers",
        difficulty: "hard"
      },
      {
        id: 7,
        question: "What are the key differences between BERT and GPT architectures?",
        answer: "BERT uses bidirectional encoding for understanding tasks, while GPT uses unidirectional (left-to-right) decoding for generation tasks. BERT is encoder-only, GPT is decoder-only.",
        category: "Transformers",
        difficulty: "hard"
      },
      {
        id: 8,
        question: "Describe the concept of transfer learning in deep learning.",
        answer: "Transfer learning involves taking a pre-trained model and adapting it for a new but related task, leveraging learned features to improve performance on the new task with less data.",
        category: "Deep Learning",
        difficulty: "medium"
      },
      {
        id: 9,
        question: "What is the role of layer normalization in transformers?",
        answer: "Layer normalization stabilizes training by normalizing inputs across features for each sample, helping with gradient flow and enabling deeper networks to train effectively.",
        category: "Transformers",
        difficulty: "hard"
      },
      {
        id: 10,
        question: "Explain the concept of few-shot learning in large language models.",
        answer: "Few-shot learning is the ability of models to learn new tasks from just a few examples, typically demonstrated by providing examples in the prompt without updating model parameters.",
        category: "NLP",
        difficulty: "hard"
      }
    ];

    const quizQuestions: QuizQuestion[] = [
      {
        id: 1,
        question: "Which activation function is most commonly used in hidden layers of modern deep networks?",
        options: ["Sigmoid", "Tanh", "ReLU", "Linear"],
        correctAnswer: 2,
        category: "Deep Learning",
        difficulty: "easy"
      },
      {
        id: 2,
        question: "What does GPT stand for?",
        options: ["General Purpose Transformer", "Generative Pre-trained Transformer", "Global Pattern Tracker", "Gradient Processing Tool"],
        correctAnswer: 1,
        category: "Transformers",
        difficulty: "easy"
      },
      {
        id: 3,
        question: "In a transformer model, what is the purpose of positional encoding?",
        options: [
          "To reduce model size",
          "To provide sequence order information",
          "To improve training speed",
          "To prevent overfitting"
        ],
        correctAnswer: 1,
        category: "Transformers",
        difficulty: "medium"
      },
      {
        id: 4,
        question: "Which of the following is NOT a type of machine learning?",
        options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Deterministic Learning"],
        correctAnswer: 3,
        category: "Machine Learning Basics",
        difficulty: "easy"
      },
      {
        id: 5,
        question: "What is the main advantage of using LSTM over standard RNN?",
        options: [
          "Faster training",
          "Smaller model size",
          "Better handling of long-term dependencies",
          "Lower computational cost"
        ],
        correctAnswer: 2,
        category: "Deep Learning",
        difficulty: "medium"
      },
      // Advanced questions
      {
        id: 6,
        question: "What is the key innovation in the Transformer architecture compared to RNNs?",
        options: [
          "Using convolutional layers",
          "Parallel processing with self-attention",
          "Larger embedding dimensions",
          "More hidden layers"
        ],
        correctAnswer: 1,
        category: "Transformers",
        difficulty: "hard"
      },
      {
        id: 7,
        question: "In BERT, what does the [MASK] token represent?",
        options: [
          "End of sequence",
          "Unknown word",
          "Token to be predicted",
          "Attention mask"
        ],
        correctAnswer: 2,
        category: "Transformers",
        difficulty: "medium"
      },
      {
        id: 8,
        question: "What is gradient clipping used for in deep learning?",
        options: [
          "Preventing exploding gradients",
          "Reducing model size",
          "Speeding up training",
          "Improving accuracy"
        ],
        correctAnswer: 0,
        category: "Deep Learning",
        difficulty: "hard"
      },
      {
        id: 9,
        question: "Which technique helps with the cold start problem in recommendation systems?",
        options: [
          "Collaborative filtering",
          "Content-based filtering",
          "Transfer learning",
          "All of the above"
        ],
        correctAnswer: 3,
        category: "Machine Learning Basics",
        difficulty: "hard"
      },
      {
        id: 10,
        question: "What is the purpose of attention heads in multi-head attention?",
        options: [
          "To increase model size",
          "To capture different types of relationships",
          "To reduce computation",
          "To prevent overfitting"
        ],
        correctAnswer: 1,
        category: "Transformers",
        difficulty: "hard"
      }
    ];

    this.flashcardsSubject.next(flashcards);
    this.quizQuestionsSubject.next(quizQuestions);
    this.initializeLearningPaths();
  }

  private loadProgress(): void {
    // Load progress from localStorage or initialize empty
    const savedProgress = localStorage.getItem('userProgress');
    const savedHistory = localStorage.getItem('quizHistory');
    
    if (savedProgress) {
      this.userProgressSubject.next(JSON.parse(savedProgress));
    }
    
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      // Convert date strings back to Date objects
      history.forEach((session: any) => {
        session.completedAt = new Date(session.completedAt);
      });
      this.quizHistorySubject.next(history);
    }
  }

  private initializeLearningPaths(): void {
    const categories = this.getCategories();
    const learningPaths: LearningPath[] = categories.map(category => ({
      category,
      currentLevel: 1,
      unlockedQuestions: this.getInitialUnlockedQuestions(category),
      masteredQuestions: [],
      strugglingQuestions: []
    }));
    
    this.learningPathsSubject.next(learningPaths);
  }

  private getInitialUnlockedQuestions(category: string): number[] {
    // Start with easy questions only
    const easyQuestions = this.quizQuestionsSubject.value
      .filter(q => q.category === category && q.difficulty === 'easy')
      .map(q => q.id);
    
    const easyFlashcards = this.flashcardsSubject.value
      .filter(f => f.category === category && f.difficulty === 'easy')
      .map(f => f.id);
    
    return [...easyQuestions, ...easyFlashcards];
  }

  private saveProgress(): void {
    localStorage.setItem('userProgress', JSON.stringify(this.userProgressSubject.value));
    localStorage.setItem('quizHistory', JSON.stringify(this.quizHistorySubject.value));
  }

  getFlashcards(): Observable<Flashcard[]> {
    return this.flashcards$;
  }

  getQuizQuestions(): Observable<QuizQuestion[]> {
    return this.quizQuestions$;
  }

  getFlashcardsByCategory(category: string): Observable<Flashcard[]> {
    return new BehaviorSubject(
      this.flashcardsSubject.value.filter(card => card.category === category)
    ).asObservable();
  }

  getQuizQuestionsByCategory(category: string): Observable<QuizQuestion[]> {
    return new BehaviorSubject(
      this.quizQuestionsSubject.value.filter(question => question.category === category)
    ).asObservable();
  }

  getCategories(): string[] {
    const flashcardCategories = [...new Set(this.flashcardsSubject.value.map(card => card.category))];
    const quizCategories = [...new Set(this.quizQuestionsSubject.value.map(question => question.category))];
    return [...new Set([...flashcardCategories, ...quizCategories])];
  }

  // Progress tracking methods
  recordQuizSession(session: QuizSession): void {
    const history = [...this.quizHistorySubject.value, session];
    this.quizHistorySubject.next(history);
    
    this.updateUserProgress(session);
    this.updateLearningPath(session);
    this.saveProgress();
  }

  private updateUserProgress(session: QuizSession): void {
    const currentProgress = [...this.userProgressSubject.value];
    const existingIndex = currentProgress.findIndex(p => p.category === session.category);
    
    const scorePercentage = (session.correctAnswers / session.totalQuestions) * 100;
    
    if (existingIndex >= 0) {
      const existing = currentProgress[existingIndex];
      existing.totalAttempts++;
      existing.correctAnswers += session.correctAnswers;
      existing.averageScore = (existing.averageScore * (existing.totalAttempts - 1) + scorePercentage) / existing.totalAttempts;
      existing.lastAttempt = session.completedAt;
      
      // Update strong/weak topics based on recent performance
      this.updateTopicStrengths(existing, session);
    } else {
      const newProgress: UserProgress = {
        category: session.category,
        totalAttempts: 1,
        correctAnswers: session.correctAnswers,
        averageScore: scorePercentage,
        lastAttempt: session.completedAt,
        strongTopics: scorePercentage >= 80 ? [session.category] : [],
        weakTopics: scorePercentage < 60 ? [session.category] : [],
        recommendedDifficulty: scorePercentage >= 80 ? 'medium' : 'easy'
      };
      currentProgress.push(newProgress);
    }
    
    this.userProgressSubject.next(currentProgress);
  }

  private updateTopicStrengths(progress: UserProgress, session: QuizSession): void {
    const scorePercentage = (session.correctAnswers / session.totalQuestions) * 100;
    
    if (scorePercentage >= 80) {
      if (!progress.strongTopics.includes(session.category)) {
        progress.strongTopics.push(session.category);
      }
      progress.weakTopics = progress.weakTopics.filter(topic => topic !== session.category);
      
      // Upgrade recommended difficulty
      if (progress.averageScore >= 85) {
        progress.recommendedDifficulty = progress.recommendedDifficulty === 'easy' ? 'medium' : 'hard';
      }
    } else if (scorePercentage < 60) {
      if (!progress.weakTopics.includes(session.category)) {
        progress.weakTopics.push(session.category);
      }
      progress.strongTopics = progress.strongTopics.filter(topic => topic !== session.category);
      progress.recommendedDifficulty = 'easy';
    }
  }

  private updateLearningPath(session: QuizSession): void {
    const learningPaths = [...this.learningPathsSubject.value];
    const pathIndex = learningPaths.findIndex(path => path.category === session.category);
    
    if (pathIndex >= 0) {
      const path = learningPaths[pathIndex];
      const scorePercentage = (session.correctAnswers / session.totalQuestions) * 100;
      
      // Update mastered and struggling questions
      session.results.forEach(result => {
        if (result.isCorrect && !path.masteredQuestions.includes(result.questionId)) {
          path.masteredQuestions.push(result.questionId);
          // Remove from struggling if it was there
          path.strugglingQuestions = path.strugglingQuestions.filter(id => id !== result.questionId);
        } else if (!result.isCorrect && !path.strugglingQuestions.includes(result.questionId)) {
          path.strugglingQuestions.push(result.questionId);
        }
      });
      
      // Unlock new questions based on performance
      if (scorePercentage >= 75) {
        this.unlockNextQuestions(path);
      }
      
      this.learningPathsSubject.next(learningPaths);
    }
  }

  private unlockNextQuestions(path: LearningPath): void {
    const category = path.category;
    const allQuestions = [
      ...this.quizQuestionsSubject.value.filter(q => q.category === category),
      ...this.flashcardsSubject.value.filter(f => f.category === category)
    ];
    
    // Unlock medium questions if user has mastered easy ones
    const easyQuestions = allQuestions.filter(q => q.difficulty === 'easy');
    const mediumQuestions = allQuestions.filter(q => q.difficulty === 'medium');
    const hardQuestions = allQuestions.filter(q => q.difficulty === 'hard');
    
    const masteredEasy = easyQuestions.filter(q => path.masteredQuestions.includes(q.id)).length;
    const masteredMedium = mediumQuestions.filter(q => path.masteredQuestions.includes(q.id)).length;
    
    // Unlock medium if 70% of easy questions are mastered
    if (masteredEasy >= easyQuestions.length * 0.7) {
      mediumQuestions.forEach(q => {
        if (!path.unlockedQuestions.includes(q.id)) {
          path.unlockedQuestions.push(q.id);
        }
      });
      path.currentLevel = Math.max(path.currentLevel, 2);
    }
    
    // Unlock hard if 70% of medium questions are mastered
    if (masteredMedium >= mediumQuestions.length * 0.7) {
      hardQuestions.forEach(q => {
        if (!path.unlockedQuestions.includes(q.id)) {
          path.unlockedQuestions.push(q.id);
        }
      });
      path.currentLevel = Math.max(path.currentLevel, 3);
    }
  }

  // Adaptive question selection
  getAdaptiveQuestions(category: string): Observable<QuizQuestion[]> {
    const userProgress = this.userProgressSubject.value.find(p => p.category === category);
    const learningPath = this.learningPathsSubject.value.find(p => p.category === category);
    
    let questions = this.quizQuestionsSubject.value.filter(q => q.category === category);
    
    if (learningPath) {
      // Only include unlocked questions
      questions = questions.filter(q => learningPath.unlockedQuestions.includes(q.id));
      
      // Prioritize struggling questions
      if (learningPath.strugglingQuestions.length > 0) {
        const strugglingQuestions = questions.filter(q => learningPath.strugglingQuestions.includes(q.id));
        const otherQuestions = questions.filter(q => !learningPath.strugglingQuestions.includes(q.id));
        questions = [...strugglingQuestions, ...otherQuestions];
      }
    }
    
    if (userProgress) {
      // Filter by recommended difficulty
      const recommendedQuestions = questions.filter(q => q.difficulty === userProgress.recommendedDifficulty);
      if (recommendedQuestions.length >= 3) {
        questions = recommendedQuestions;
      }
    }
    
    return new BehaviorSubject(questions).asObservable();
  }

  getAdaptiveFlashcards(category: string): Observable<Flashcard[]> {
    const learningPath = this.learningPathsSubject.value.find(p => p.category === category);
    
    let flashcards = this.flashcardsSubject.value.filter(f => f.category === category);
    
    if (learningPath) {
      // Only include unlocked flashcards
      flashcards = flashcards.filter(f => learningPath.unlockedQuestions.includes(f.id));
      
      // Prioritize struggling concepts
      if (learningPath.strugglingQuestions.length > 0) {
        const strugglingCards = flashcards.filter(f => learningPath.strugglingQuestions.includes(f.id));
        const otherCards = flashcards.filter(f => !learningPath.strugglingQuestions.includes(f.id));
        flashcards = [...strugglingCards, ...otherCards];
      }
    }
    
    return new BehaviorSubject(flashcards).asObservable();
  }

  // Progress analytics
  getUserProgress(): Observable<UserProgress[]> {
    return this.userProgress$;
  }

  getQuizHistory(): Observable<QuizSession[]> {
    return this.quizHistory$;
  }

  getLearningPaths(): Observable<LearningPath[]> {
    return this.learningPaths$;
  }

  getCategoryProgress(category: string): UserProgress | undefined {
    return this.userProgressSubject.value.find(p => p.category === category);
  }

  getRecommendedStudyPlan(): { category: string; priority: 'high' | 'medium' | 'low'; reason: string }[] {
    const progress = this.userProgressSubject.value;
    const recommendations: { category: string; priority: 'high' | 'medium' | 'low'; reason: string }[] = [];
    
    progress.forEach(p => {
      if (p.averageScore < 60) {
        recommendations.push({
          category: p.category,
          priority: 'high',
          reason: `Low average score (${p.averageScore.toFixed(1)}%). Focus on fundamentals.`
        });
      } else if (p.averageScore < 80) {
        recommendations.push({
          category: p.category,
          priority: 'medium',
          reason: `Moderate performance (${p.averageScore.toFixed(1)}%). Room for improvement.`
        });
      } else {
        recommendations.push({
          category: p.category,
          priority: 'low',
          reason: `Strong performance (${p.averageScore.toFixed(1)}%). Consider advanced topics.`
        });
      }
    });
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }
}
