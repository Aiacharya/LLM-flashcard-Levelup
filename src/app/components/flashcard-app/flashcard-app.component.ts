import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudyModeComponent } from '../study-mode/study-mode.component';
import { QuizModeComponent } from '../quiz-mode/quiz-mode.component';
import { ProgressDashboardComponent } from '../progress-dashboard/progress-dashboard.component';
import { AppMode } from '../../types/flashcard.types';

type ExtendedAppMode = AppMode | 'progress';

@Component({
  selector: 'app-flashcard-app',
  standalone: true,
  imports: [CommonModule, StudyModeComponent, QuizModeComponent, ProgressDashboardComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">LLM Flashcard App</h1>
        <p class="text-gray-600 mb-2">Master LLM concepts through interactive learning</p>
        <p class="text-sm text-gray-500">
          Created by <strong>Pankaj</strong> - GenAI Guru | 
          <a href="https://www.linkedin.com/in/genai-guru-pankaj/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">
            Connect on LinkedIn
          </a>
        </p>
      </header>

      <!-- Mode Toggle -->
      <div class="flex justify-center mb-8">
        <div class="bg-white rounded-lg p-1 shadow-md">
          <button
            (click)="setMode('study')"
            [class]="'px-6 py-2 rounded-md font-medium transition-all duration-200 ' + 
                    (currentMode() === 'study' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-800')"
          >
            Study Mode
          </button>
          <button
            (click)="setMode('quiz')"
            [class]="'px-6 py-2 rounded-md font-medium transition-all duration-200 ' + 
                    (currentMode() === 'quiz' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-800')"
          >
            Quiz Mode
          </button>
          <button
            (click)="setMode('progress')"
            [class]="'px-6 py-2 rounded-md font-medium transition-all duration-200 ' + 
                    (currentMode() === 'progress' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-800')"
          >
            Progress
          </button>
        </div>
      </div>

      <!-- Content -->
      <main>
        @if (currentMode() === 'study') {
          <app-study-mode />
        } @else if (currentMode() === 'quiz') {
          <app-quiz-mode />
        } @else {
          <app-progress-dashboard />
        }
      </main>
    </div>
  `,
  styles: []
})
export class FlashcardAppComponent {
  currentMode = signal<ExtendedAppMode>('study');

  setMode(mode: ExtendedAppMode): void {
    this.currentMode.set(mode);
  }
}
