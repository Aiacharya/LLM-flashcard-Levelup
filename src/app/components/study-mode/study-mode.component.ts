import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashcardService } from '../../services/flashcard.service';
import { Flashcard } from '../../types/flashcard.types';

@Component({
  selector: 'app-study-mode',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <!-- Controls -->
      <div class="flex flex-wrap gap-4 mb-6 justify-between items-center">
        <div class="flex flex-wrap gap-2">
          <button
            (click)="setSelectedCategory('all')"
            [class]="'px-4 py-2 rounded-lg font-medium transition-colors duration-200 ' + 
                    (selectedCategory() === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')"
          >
            All Categories
          </button>
          @for (category of categories; track category) {
            <button
              (click)="setSelectedCategory(category)"
              [class]="'px-4 py-2 rounded-lg font-medium transition-colors duration-200 ' + 
                      (selectedCategory() === category ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')"
            >
              {{ category }}
            </button>
          }
        </div>
        
        <div class="text-sm text-gray-600">
          {{ currentIndex() + 1 }} / {{ filteredCards().length }}
        </div>
      </div>

      <!-- Flashcard -->
      @if (filteredCards().length > 0) {
        <div class="bg-white rounded-xl shadow-lg p-8 mb-6 min-h-[400px] card-hover">
          <div class="flex flex-col h-full">
            <!-- Card Header -->
            <div class="flex justify-between items-center mb-6">
              <span [class]="'px-3 py-1 rounded-full text-sm font-medium ' + getDifficultyColor(currentCard().difficulty)">
                {{ currentCard().difficulty }}
              </span>
              <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {{ currentCard().category }}
              </span>
            </div>

            <!-- Card Content -->
            <div class="flex-1 flex flex-col">
              <h3 class="text-xl font-semibold text-gray-800 mb-4">Question</h3>
              <p class="text-gray-700 mb-6 leading-relaxed">{{ currentCard().question }}</p>
              
              @if (showAnswer()) {
                <div class="border-t pt-4">
                  <h3 class="text-xl font-semibold text-gray-800 mb-4">Answer</h3>
                  <p class="text-gray-700 leading-relaxed">{{ currentCard().answer }}</p>
                </div>
              }
            </div>

            <!-- Card Actions -->
            <div class="flex justify-center mt-6">
              @if (!showAnswer()) {
                <button
                  (click)="toggleAnswer()"
                  class="btn-primary"
                >
                  Show Answer
                </button>
              } @else {
                <button
                  (click)="toggleAnswer()"
                  class="btn-secondary"
                >
                  Hide Answer
                </button>
              }
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between items-center">
          <button
            (click)="previousCard()"
            [disabled]="currentIndex() === 0"
            class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Previous
          </button>

          <div class="flex gap-2">
            @for (card of filteredCards(); track card.id; let i = $index) {
              <button
                (click)="setCurrentIndex(i)"
                [class]="'w-3 h-3 rounded-full transition-colors duration-200 ' + 
                        (i === currentIndex() ? 'bg-primary-600' : 'bg-gray-300 hover:bg-gray-400')"
              ></button>
            }
          </div>

          <button
            (click)="nextCard()"
            [disabled]="currentIndex() === filteredCards().length - 1"
            class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Next
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      } @else {
        <div class="text-center py-12">
          <div class="text-gray-500 text-lg">No flashcards available for the selected category.</div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class StudyModeComponent implements OnInit {
  private flashcardService = inject(FlashcardService);

  flashcards = signal<Flashcard[]>([]);
  selectedCategory = signal<string>('all');
  currentIndex = signal<number>(0);
  showAnswer = signal<boolean>(false);
  categories: string[] = [];

  ngOnInit(): void {
    this.flashcardService.getFlashcards().subscribe(cards => {
      this.flashcards.set(cards);
    });
    this.categories = this.flashcardService.getCategories();
  }

  filteredCards(): Flashcard[] {
    if (this.selectedCategory() === 'all') {
      return this.flashcards();
    }
    
    // Use adaptive flashcards for better learning experience
    let adaptiveCards: Flashcard[] = [];
    this.flashcardService.getAdaptiveFlashcards(this.selectedCategory()).subscribe(cards => {
      adaptiveCards = cards;
    });
    
    // Fallback to regular filtering if adaptive cards aren't available
    if (adaptiveCards.length === 0) {
      return this.flashcards().filter(card => card.category === this.selectedCategory());
    }
    
    return adaptiveCards;
  }

  currentCard(): Flashcard {
    return this.filteredCards()[this.currentIndex()];
  }

  setSelectedCategory(category: string): void {
    this.selectedCategory.set(category);
    this.currentIndex.set(0);
    this.showAnswer.set(false);
  }

  setCurrentIndex(index: number): void {
    this.currentIndex.set(index);
    this.showAnswer.set(false);
  }

  previousCard(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.set(this.currentIndex() - 1);
      this.showAnswer.set(false);
    }
  }

  nextCard(): void {
    if (this.currentIndex() < this.filteredCards().length - 1) {
      this.currentIndex.set(this.currentIndex() + 1);
      this.showAnswer.set(false);
    }
  }

  toggleAnswer(): void {
    this.showAnswer.set(!this.showAnswer());
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
}
