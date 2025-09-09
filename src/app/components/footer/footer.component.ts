import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-gray-50 border-t border-gray-200 mt-16 py-8">
      <div class="container mx-auto px-4 text-center">
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Built with ❤️ for AI Education</h3>
          <p class="text-gray-600">
            Created by <strong>Pankaj</strong> - GenAI Guru
          </p>
        </div>
        
        <div class="flex justify-center items-center space-x-4 mb-4">
          <a 
            href="https://www.linkedin.com/in/genai-guru-pankaj/" 
            target="_blank" 
            rel="noopener noreferrer"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clip-rule="evenodd"></path>
            </svg>
            Connect on LinkedIn
          </a>
        </div>
        
        <div class="text-sm text-gray-500">
          <p class="mb-2">
            <strong>LLM Flashcard App</strong> - Master AI/ML concepts through interactive learning
          </p>
          <p>
            Built with Angular 18, TypeScript, and TailwindCSS
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {}
