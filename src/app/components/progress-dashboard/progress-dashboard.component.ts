import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashcardService } from '../../services/flashcard.service';
import { UserProgress, LearningPath } from '../../types/flashcard.types';

@Component({
  selector: 'app-progress-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Progress Overview -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Learning Progress</h2>
        
        @if (userProgress().length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (progress of userProgress(); track progress.category) {
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div class="flex justify-between items-start mb-3">
                  <h3 class="font-semibold text-gray-800">{{ progress.category }}</h3>
                  <span [class]="'px-2 py-1 rounded-full text-xs font-medium ' + getScoreColor(progress.averageScore)">
                    {{ progress.averageScore.toFixed(1) }}%
                  </span>
                </div>
                
                <div class="space-y-2">
                  <div class="flex justify-between text-sm text-gray-600">
                    <span>Attempts:</span>
                    <span>{{ progress.totalAttempts }}</span>
                  </div>
                  <div class="flex justify-between text-sm text-gray-600">
                    <span>Level:</span>
                    <span>{{ getDifficultyLevel(progress.recommendedDifficulty) }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      [style.width.%]="progress.averageScore"
                    ></div>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="text-center py-8 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <p>Start taking quizzes to track your progress!</p>
          </div>
        }
      </div>

      <!-- Learning Paths -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Learning Paths</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          @for (path of learningPaths(); track path.category) {
            <div class="border rounded-lg p-4">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-semibold text-lg text-gray-800">{{ path.category }}</h3>
                <div class="flex items-center space-x-2">
                  @for (level of [1,2,3]; track level) {
                    <div [class]="'w-3 h-3 rounded-full ' + (level <= path.currentLevel ? 'bg-green-500' : 'bg-gray-300')"></div>
                  }
                </div>
              </div>
              
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Unlocked Questions:</span>
                  <span class="font-medium">{{ path.unlockedQuestions.length }}</span>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Mastered:</span>
                  <span class="font-medium text-green-600">{{ path.masteredQuestions.length }}</span>
                </div>
                
                @if (path.strugglingQuestions.length > 0) {
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Need Practice:</span>
                    <span class="font-medium text-orange-600">{{ path.strugglingQuestions.length }}</span>
                  </div>
                }
                
                <div class="text-sm text-gray-500">
                  Level {{ path.currentLevel }} - {{ getLevelDescription(path.currentLevel) }}
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Study Recommendations -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Recommended Study Plan</h2>
        
        @if (recommendations().length > 0) {
          <div class="space-y-3">
            @for (rec of recommendations(); track rec.category) {
              <div [class]="'border-l-4 p-4 rounded-r-lg ' + getPriorityBorder(rec.priority)">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-semibold text-gray-800">{{ rec.category }}</h3>
                    <p class="text-sm text-gray-600 mt-1">{{ rec.reason }}</p>
                  </div>
                  <span [class]="'px-3 py-1 rounded-full text-xs font-medium ' + getPriorityColor(rec.priority)">
                    {{ rec.priority | titlecase }} Priority
                  </span>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="text-center py-8 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <p>Complete some quizzes to get personalized recommendations!</p>
          </div>
        }
      </div>

      <!-- Recent Activity -->
      @if (recentQuizzes().length > 0) {
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Recent Quiz Activity</h2>
          
          <div class="space-y-3">
            @for (quiz of recentQuizzes(); track $index) {
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <span class="font-medium text-gray-800">{{ quiz.category }}</span>
                  <span class="text-sm text-gray-500 ml-2">
                    {{ quiz.completedAt | date:'short' }}
                  </span>
                </div>
                <div class="flex items-center space-x-4">
                  <span class="text-sm text-gray-600">
                    {{ quiz.correctAnswers }}/{{ quiz.totalQuestions }}
                  </span>
                  <span [class]="'px-2 py-1 rounded-full text-xs font-medium ' + getScoreColor((quiz.correctAnswers / quiz.totalQuestions) * 100)">
                    {{ ((quiz.correctAnswers / quiz.totalQuestions) * 100).toFixed(0) }}%
                  </span>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class ProgressDashboardComponent implements OnInit {
  private flashcardService = inject(FlashcardService);

  userProgress = signal<UserProgress[]>([]);
  learningPaths = signal<LearningPath[]>([]);
  recommendations = signal<{ category: string; priority: 'high' | 'medium' | 'low'; reason: string }[]>([]);
  recentQuizzes = signal<any[]>([]);

  ngOnInit(): void {
    this.flashcardService.getUserProgress().subscribe(progress => {
      this.userProgress.set(progress);
    });

    this.flashcardService.getLearningPaths().subscribe(paths => {
      this.learningPaths.set(paths);
    });

    this.recommendations.set(this.flashcardService.getRecommendedStudyPlan());

    this.flashcardService.getQuizHistory().subscribe(history => {
      // Get recent 5 quizzes
      const recent = history
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
        .slice(0, 5);
      this.recentQuizzes.set(recent);
    });
  }

  getScoreColor(score: number): string {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }

  getDifficultyLevel(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return 'Beginner';
      case 'medium': return 'Intermediate';
      case 'hard': return 'Advanced';
      default: return 'Beginner';
    }
  }

  getLevelDescription(level: number): string {
    switch (level) {
      case 1: return 'Fundamental concepts';
      case 2: return 'Intermediate understanding';
      case 3: return 'Advanced mastery';
      default: return 'Getting started';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityBorder(priority: string): string {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-50';
      case 'medium': return 'border-yellow-400 bg-yellow-50';
      case 'low': return 'border-green-400 bg-green-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  }
}
