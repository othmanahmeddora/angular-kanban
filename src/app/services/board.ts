import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import data from '../../../data.json';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly STORAGE_KEY = 'kanban-boards';
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private boards: any[];

  constructor() {
    if (this.isBrowser) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      this.boards = stored ? JSON.parse(stored) : data.boards;
    } else {
      this.boards = data.boards;
    }
  }

  private save() {
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.boards));
    }
  }

  getBoards() {
    return this.boards;
  }

  getBoardByIndex(index: number) {
    return this.boards[index];
  }

  addBoard(name: string, columns: string[]) {
    this.boards.push({
      name,
      columns: columns.map((col) => ({ name: col, tasks: [] })),
    });
    this.save();
    return this.boards.length - 1;
  }

  addColumn(boardIndex: number, name: string) {
    this.boards[boardIndex].columns.push({ name, tasks: [] });
    this.save();
  }

  addTask(boardIndex: number, columnName: string, task: any) {
    const column = this.boards[boardIndex].columns.find((col: any) => col.name === columnName);
    if (column) {
      column.tasks.push(task);
      this.save();
    }
  }

  // shared signal for task form
  isTaskFormOpen = false;
  openTaskForm() {
    this.isTaskFormOpen = true;
  }
  closeTaskForm() {
    this.isTaskFormOpen = false;
  }
}
