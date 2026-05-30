import { Component, inject, output } from '@angular/core';
import { Router } from '@angular/router';
import { BoardService } from '../services/board';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  host: { class: 'block w-[16rem] shrink-0 h-full' },
  imports: [FormsModule],
  templateUrl: './app-sidebar.html',
  styleUrl: './app-sidebar.css',
})
export class AppSidebar {
  private boardService = inject(BoardService);
  private router = inject(Router);

  boardSelected = output<number>();

  get boards() {
    return this.boardService.getBoards();
  }

  activeIndex = 0;

  selectBoard(index: number) {
    this.activeIndex = index;
    this.boardSelected.emit(index);
    this.router.navigate(['/board', index]);
  }

  isClicked = false;
  newBoardName = '';
  newBoardColumns: string[] = ['Todo', 'Doing', 'Done'];

  handleBoardFormOpen() {
    this.isClicked = true;
  }
  handleBoardFormClose() {
    this.isClicked = false;
    this.newBoardName = '';
    this.newBoardColumns = ['Todo', 'Doing', 'Done'];
  }

  addColumn() {
    this.newBoardColumns.push('');
  }
  removeColumn(index: number) {
    this.newBoardColumns.splice(index, 1);
  }

  submitBoard() {
    if (!this.newBoardName.trim()) return;
    const filtered = this.newBoardColumns.filter((col) => col.trim());
    const newIndex = this.boardService.addBoard(this.newBoardName.trim(), filtered);
    this.handleBoardFormClose();
    this.selectBoard(newIndex);
  }

  isDark = true;
  toggleTheme() {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark', this.isDark);
  }
}
