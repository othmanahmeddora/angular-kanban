import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import data from '../../../data.json';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly STORAGE_KEY = 'kanban-boards';
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private _boards = signal<any[]>([]);

  constructor() {
    if (this.isBrowser) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      this._boards.set(stored ? JSON.parse(stored) : data.boards);
    } else {
      this._boards.set(data.boards);
    }
  }

  private save() {
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._boards()));
    }
  }

  getBoards() {
    return this._boards();
  }

  getBoardByIndex(index: number) {
    return this._boards()[index];
  }

  addBoard(name: string, columns: string[]) {
    this._boards.update((boards) => [
      ...boards,
      {
        name,
        columns: columns.map((col) => ({ name: col, tasks: [] })),
      },
    ]);
    this.save();
    return this._boards().length - 1;
  }

  addColumn(boardIndex: number, name: string) {
    this._boards.update((boards) => {
      boards[boardIndex].columns.push({ name, tasks: [] });
      return [...boards];
    });
    this.save();
  }

  addTask(boardIndex: number, columnName: string, task: any) {
    this._boards.update((boards) => {
      const column = boards[boardIndex].columns.find((col: any) => col.name === columnName);
      if (column) column.tasks.push(task);
      return [...boards];
    });
    this.save();
  }

  isTaskFormOpen = signal(false);
  openTaskForm() {
    this.isTaskFormOpen.set(true);
  }
  closeTaskForm() {
    this.isTaskFormOpen.set(false);
  }
}
