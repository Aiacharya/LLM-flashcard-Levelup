import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlashcardService } from '../../services/flashcard.service';
import { QuizQuestion, QuizSession, QuizResult } from '../../types/flashcard.types';

@Component({
  selector: 'app-quiz-mode',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto">
      @if (!quizStarted()) {
        <!-- Quiz Setup -->
        <div class="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Start Your Quiz</h2>
          
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Select Category</label>
            <select
              [(ngModel)]="selectedCategory"
              class="w-full max-w-xs mx-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Categories</option>
              @for (category of categories; track category) {
                <option [value]="category">{{ category }}</option>
              }
            </select>
          </div>

          <button
            (click)="startQuiz()"
            class="btn-primary text-lg px-8 py-3"
            [disabled]="getAvailableQuestions().length === 0"
          >
            Start Quiz ({{ getAvailableQuestions().length }} questions)
          </button>
        </div>
      } @else if (!quizCompleted()) {
        <!-- Quiz Question -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <!-- Progress -->
          <div class="mb-6">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700">Question {{ currentQuestionIndex() + 1 }} of {{ questions().length }}</span>
              <span class="text-sm text-gray-500">{{ formatTime(timeElapsed()) }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                [style.width.%]="((currentQuestionIndex() + 1) / questions().length) * 100"
              ></div>
            </div>
          </div>

          <!-- Question -->
          <div class="mb-8">
            <div class="flex justify-between items-center mb-4">
              <span [class]="'px-3 py-1 rounded-full text-sm font-medium ' + getDifficultyColor(currentQuestion().difficulty)">
                {{ currentQuestion().difficulty }}
              </span>
              <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {{ currentQuestion().category }}
              </span>
            </div>
            
            <h3 class="text-xl font-semibold text-gray-800 mb-6">{{ currentQuestion().question }}</h3>
            
            <div class="space-y-3">
              @for (option of currentQuestion().options; track $index; let i = $index) {
                <button
                  (click)="selectAnswer(i)"
                  [class]="'w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ' + getOptionClass(i)"
                >
                  <span class="font-medium mr-3">{{ getLetter(i) }}.</span>
                  {{ option }}
                </button>
              }
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-between">
            <button
              (click)="previousQuestion()"
              [disabled]="currentQuestionIndex() === 0"
              class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Previous
            </button>

            @if (currentQuestionIndex() === questions().length - 1) {
              <button
                (click)="completeQuiz()"
                [disabled]="selectedAnswers()[currentQuestionIndex()] === undefined"
                class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Complete Quiz
              </button>
            } @else {
              <button
                (click)="nextQuestion()"
                [disabled]="selectedAnswers()[currentQuestionIndex()] === undefined"
                class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            }
          </div>
        </div>
      } @else {
        <!-- Quiz Results -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
            <div class="text-6xl mb-4">
              @if (getScorePercentage() >= 80) {
                🎉
              } @else if (getScorePercentage() >= 60) {
                👍
              } @else {
                📚
              }
            </div>
            <div class="text-2xl font-semibold text-primary-600 mb-2">
              {{ quizSession()?.correctAnswers }} / {{ quizSession()?.totalQuestions }}
            </div>
            <div class="text-lg text-gray-600">
              {{ getScorePercentage() }}% · {{ formatTime(quizSession()?.totalTime || 0) }}
            </div>
          </div>

          <!-- Detailed Results -->
          <div class="space-y-4 mb-8">
            @for (result of quizSession()?.results; track $index; let i = $index) {
              <div [class]="'p-4 rounded-lg border-l-4 ' + (result.isCorrect ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400')">
                <div class="flex justify-between items-start mb-2">
                  <span class="text-sm font-medium text-gray-600">Question {{ i + 1 }}</span>
                  <span [class]="'text-sm font-medium ' + (result.isCorrect ? 'text-green-600' : 'text-red-600')">
                    {{ result.isCorrect ? 'Correct' : 'Incorrect' }} · {{ formatTime(result.timeTaken) }}
                  </span>
                </div>
                <p class="text-gray-800 mb-2">{{ questions()[i].question }}</p>
                <div class="text-sm">
                  <span class="text-gray-600">Your answer: </span>
                  <span [class]="result.isCorrect ? 'text-green-600' : 'text-red-600'">
                    {{ questions()[i].options[result.selectedAnswer] }}
                  </span>
                  @if (!result.isCorrect) {
                    <div class="mt-1">
                      <span class="text-gray-600">Correct answer: </span>
                      <span class="text-green-600">{{ questions()[i].options[questions()[i].correctAnswer] }}</span>
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <div class="flex justify-center">
            <button
              (click)="resetQuiz()"
              class="btn-primary"
            >
              Take Another Quiz
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class QuizModeComponent implements OnInit {
  private flashcardService = inject(FlashcardService);

  quizQuestions = signal<QuizQuestion[]>([]);
  selectedCategory = 'all';
  categories: string[] = [];

  // Quiz state
  quizStarted = signal<boolean>(false);
  quizCompleted = signal<boolean>(false);
  questions = signal<QuizQuestion[]>([]);
  currentQuestionIndex = signal<number>(0);
  selectedAnswers = signal<(number | undefined)[]>([]);
  questionStartTime = signal<number>(0);
  timeElapsed = signal<number>(0);
  quizSession = signal<QuizSession | undefined>(undefined);

  private timer: any;

  ngOnInit(): void {
    this.flashcardService.getQuizQuestions().subscribe(questions => {
      this.quizQuestions.set(questions);
    });
    this.categories = this.flashcardService.getCategories();
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private startTimer(): void {
    this.timer = setInterval(() => {
      if (this.quizStarted() && !this.quizCompleted()) {
        this.timeElapsed.set(Date.now() - this.questionStartTime());
      }
    }, 100);
  }

  getAvailableQuestions(): QuizQuestion[] {
    if (this.selectedCategory === 'all') {
      return this.quizQuestions();
    }
    
    // Use adaptive questions for better learning experience
    let adaptiveQuestions: QuizQuestion[] = [];
    this.flashcardService.getAdaptiveQuestions(this.selectedCategory).subscribe(questions => {
      adaptiveQuestions = questions;
    });
    
    // Fallback to regular filtering if adaptive questions aren't available
    if (adaptiveQuestions.length === 0) {
      return this.quizQuestions().filter(q => q.category === this.selectedCategory);
    }
    
    return adaptiveQuestions;
  }

  startQuiz(): void {
    const availableQuestions = this.getAvailableQuestions();
    const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
    
    this.questions.set(shuffled);
    this.selectedAnswers.set(new Array(shuffled.length).fill(undefined));
    this.currentQuestionIndex.set(0);
    this.quizStarted.set(true);
    this.quizCompleted.set(false);
    this.questionStartTime.set(Date.now());
    this.timeElapsed.set(0);
  }

  currentQuestion(): QuizQuestion {
    return this.questions()[this.currentQuestionIndex()];
  }

  selectAnswer(answerIndex: number): void {
    const answers = [...this.selectedAnswers()];
    answers[this.currentQuestionIndex()] = answerIndex;
    this.selectedAnswers.set(answers);
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.set(this.currentQuestionIndex() - 1);
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex() < this.questions().length - 1) {
      this.currentQuestionIndex.set(this.currentQuestionIndex() + 1);
    }
  }

  completeQuiz(): void {
    const results: QuizResult[] = [];
    let correctCount = 0;
    const totalTime = Date.now() - this.questionStartTime();

    this.questions().forEach((question, index) => {
      const selectedAnswer = this.selectedAnswers()[index];
      const isCorrect = selectedAnswer === question.correctAnswer;
      if (isCorrect) correctCount++;

      results.push({
        questionId: question.id,
        selectedAnswer: selectedAnswer || 0,
        isCorrect,
        timeTaken: Math.floor(totalTime / this.questions().length) // Simplified time calculation
      });
    });

    const session: QuizSession = {
      totalQuestions: this.questions().length,
      correctAnswers: correctCount,
      totalTime,
      results,
      category: this.selectedCategory,
      completedAt: new Date()
    };

    this.quizSession.set(session);
    
    // Record the session for progress tracking
    this.flashcardService.recordQuizSession(session);

    this.quizCompleted.set(true);
  }

  resetQuiz(): void {
    this.quizStarted.set(false);
    this.quizCompleted.set(false);
    this.questions.set([]);
    this.selectedAnswers.set([]);
    this.currentQuestionIndex.set(0);
    this.quizSession.set(undefined);
  }

  getOptionClass(index: number): string {
    const selected = this.selectedAnswers()[this.currentQuestionIndex()];
    if (selected === index) {
      return 'border-primary-500 bg-primary-50 text-primary-700';
    }
    return 'border-gray-200 hover:border-gray-300 hover:bg-gray-50';
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getLetter(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, D
  }

  formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getScorePercentage(): number {
    const session = this.quizSession();
    if (!session) return 0;
    return Math.round((session.correctAnswers / session.totalQuestions) * 100);
  }
}
