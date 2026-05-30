import { Component, inject, OnInit, output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BoardService } from '../services/board';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  host: { class: 'block w-[16rem] shrink-0 h-full' },
  imports: [FormsModule],
  templateUrl: './app-sidebar.html',
  styleUrl: './app-sidebar.css',
})
export class AppSidebar implements OnInit {
  private boardService = inject(BoardService);
  private router = inject(Router);

  ngOnInit() {
    this.syncIndexFromUrl(this.router.url);

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => this.syncIndexFromUrl(e.urlAfterRedirects));
  }

  syncIndexFromUrl(url: string) {
    const match = url.match(/\/board\/(\d+)/);
    if (match) this.activeIndex = Number(match[1]);
  }

  boardSelected = output<number>();
  hideSidebar = output<void>();

  onHideSidebar() {
    this.hideSidebar.emit();
  }

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

  isBoardFormSubmitted = false;

  submitBoard() {
    this.isBoardFormSubmitted = true;
    if (!this.newBoardName.trim()) return;
    const filtered = this.newBoardColumns.filter((col) => col.trim());
    const newIndex = this.boardService.addBoard(this.newBoardName.trim(), filtered);
    this.isBoardFormSubmitted = false;
    this.handleBoardFormClose();
    this.selectBoard(newIndex);
  }

  isDark = false;
  toggleTheme() {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark', this.isDark);
  }
}
