import { Component, signal } from '@angular/core';
import { AppHeader } from './app-header/app-header';

@Component({
  selector: 'app-root',
  imports: [AppHeader],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('my-first-angular-app');
}
