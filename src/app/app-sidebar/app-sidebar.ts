import { Component, computed, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BoardService } from '../services/board';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';
import { output } from '@angular/core';

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

  boardSelected = output<number>();
  hideSidebar = output<void>();

  boards = computed(() => this.boardService.getBoards());

  activeIndex = 0;
  isClicked = false;
  isDark = false;

  newBoardName = '';
  newBoardColumns: string[] = [''];
  isBoardFormSubmitted = false;

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

  selectBoard(index: number) {
    this.activeIndex = index;
    this.boardSelected.emit(index);
    this.router.navigate(['/board', index]);
  }

  handleBoardFormOpen() {
    this.isClicked = true;
  }

  handleBoardFormClose() {
    this.isClicked = false;
    this.newBoardName = '';
    this.newBoardColumns = [''];
    this.isBoardFormSubmitted = false;
  }

  addColumn() {
    this.newBoardColumns.push('');
  }

  removeColumn(index: number) {
    this.newBoardColumns.splice(index, 1);
  }

  submitBoard() {
    this.isBoardFormSubmitted = true;
    if (!this.newBoardName.trim()) return;
    const filtered = this.newBoardColumns.filter((col) => col.trim());
    const newIndex = this.boardService.addBoard(this.newBoardName.trim(), filtered);
    this.handleBoardFormClose();
    this.selectBoard(newIndex);
  }

  onHideSidebar() {
    this.hideSidebar.emit();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark', this.isDark);
  }
}
