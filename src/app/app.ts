import { Component, signal } from '@angular/core';
import { AppHeader } from './app-header/app-header';
import { AppSidebar } from './app-sidebar/app-sidebar';

@Component({
  selector: 'app-root',
  imports: [AppHeader, AppSidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('my-first-angular-app');
}
