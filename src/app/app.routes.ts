import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/flashcard-app/flashcard-app.component').then(m => m.FlashcardAppComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
