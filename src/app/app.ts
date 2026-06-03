import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AppHeader } from './app-header/app-header';
import { AppSidebar } from './app-sidebar/app-sidebar';
import { BoardService } from './services/board';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [AppHeader, AppSidebar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private boardService = inject(BoardService);
  private router = inject(Router);

  activeBoardIndex = signal(0);
  isSidebarVisible = signal(true);
  isMobileSidebarOpen = signal(false);

  activeBoardName = computed(
    () => this.boardService.getBoardByIndex(this.activeBoardIndex())?.name ?? '',
  );

  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e: any) => {
      const match = (e.urlAfterRedirects as string).match(/\/board\/(\d+)/);
      if (match) this.activeBoardIndex.set(Number(match[1]));
    });
  }

  onBoardSelected(index: number) {
    this.activeBoardIndex.set(index);
    this.isMobileSidebarOpen.set(false);
  }

  toggleSidebar() {
    this.isSidebarVisible.update((v) => !v);
  }

  toggleMobileSidebar() {
    this.isMobileSidebarOpen.update((v) => !v);
  }
}
