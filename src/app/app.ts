import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from './app-header/app-header';
import { AppSidebar } from './app-sidebar/app-sidebar';
import { BoardService } from './services/board';

@Component({
  selector: 'app-root',
  imports: [AppHeader, AppSidebar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private boardService = inject(BoardService);

  isSidebarVisible = true;
  isMobileSidebarOpen = false;
  activeBoardIndex = 0;

  get activeBoardName() {
    return this.boardService.getBoardByIndex(this.activeBoardIndex)?.name ?? '';
  }

  onBoardSelected(index: number) {
    this.activeBoardIndex = index;
    this.isMobileSidebarOpen = false;
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
  toggleMobileSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }
}
