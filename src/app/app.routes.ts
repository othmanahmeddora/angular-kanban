import { Routes } from '@angular/router';
import { AppMain } from './app-main/app-main';

export const routes: Routes = [
  { path: 'board/:index', component: AppMain },
  { path: '', redirectTo: 'board/0', pathMatch: 'full' },
];
