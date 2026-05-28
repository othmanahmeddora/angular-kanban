import { Component, signal } from '@angular/core';
import { AppHeader } from './app-header/app-header';
import { AppSidebar } from './app-sidebar/app-sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [AppHeader, AppSidebar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('my-first-angular-app');
}
