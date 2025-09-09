import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <router-outlet></router-outlet>
      <app-footer></app-footer>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'LLM Flashcard App';
}
