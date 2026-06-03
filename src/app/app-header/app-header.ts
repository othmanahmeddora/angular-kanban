import { Component, inject, Input, output } from '@angular/core';
import { BoardService } from '../services/board';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  host: { class: 'block' },
  imports: [FormsModule],
  templateUrl: './app-header.html',
  styleUrl: './app-header.css',
})
export class AppHeader {
  boardService = inject(BoardService);
  private router = inject(Router);

  @Input() boardIndex = 0;
  @Input() boardName = '';
  @Input() isMobileSidebarOpen = false;

  toggleMobileSidebar = output<void>();

  isMenuOpen = false;
  editBoardName = '';
  editBoardColumns: string[] = [];
  isEditBoardFormSubmitted = false;

  onToggleMobileSidebar() {
    this.toggleMobileSidebar.emit();
  }

  openEditBoard() {
    const board = this.boardService.getBoardByIndex(this.boardIndex);
    this.editBoardName = board.name;
    this.editBoardColumns = board.columns.map((c: any) => c.name);
    this.isMenuOpen = false;
    this.boardService.openEditBoard();
  }

  openDeleteBoard() {
    this.isMenuOpen = false;
    this.boardService.openDeleteBoard();
  }

  addEditColumn() {
    this.editBoardColumns.push('');
  }
  removeEditColumn(i: number) {
    this.editBoardColumns.splice(i, 1);
  }

  submitEditBoard() {
    this.isEditBoardFormSubmitted = true;
    if (!this.editBoardName.trim()) return;
    const columns = this.editBoardColumns.filter((c) => c.trim()).map((c) => ({ name: c.trim() }));
    this.boardService.editBoard(this.boardIndex, this.editBoardName.trim(), columns);
    this.isEditBoardFormSubmitted = false;
    this.boardService.closeEditBoard();
  }

  confirmDeleteBoard() {
    this.boardService.deleteBoard(this.boardIndex);
    this.boardService.closeDeleteBoard();
    const remaining = this.boardService.getBoards().length;
    if (remaining === 0) {
      this.router.navigate(['/']);
    } else {
      const newIndex = Math.min(this.boardIndex, remaining - 1);
      this.router.navigate(['/board', newIndex]);
    }
  }
}
