import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BoardService } from '../services/board';

@Component({
  selector: 'app-sidebar',
  host: { class: 'block w-[16rem] shrink-0 h-full' },
  imports: [],
  templateUrl: './app-sidebar.html',
  styleUrl: './app-sidebar.css',
})
export class AppSidebar {
  private boardService = inject(BoardService);
  private router = inject(Router);

  boards = this.boardService.getBoards();
  activeIndex = 0;

  selectBoard(index: number) {
    this.activeIndex = index;
    this.router.navigate(['/board', index]);
  }

  isClicked = false;

  handleBoardFormOpen() {
    this.isClicked = true;
  }

  handleBoardFormClose() {
    this.isClicked = false;
  }

  isDark = true;

  toggleTheme() {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark', this.isDark);
  }
}
