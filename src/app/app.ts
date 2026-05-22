import { Component, signal } from '@angular/core';
import { AppHeader } from './app-header/app-header';
import { AppSidebar } from './app-sidebar/app-sidebar';
import { AppMain } from './app-main/app-main';

@Component({
  selector: 'app-root',
  imports: [AppHeader, AppSidebar, AppMain],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('my-first-angular-app');
}
