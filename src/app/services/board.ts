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

  isTaskFormOpen = signal(false);
  isEditBoardOpen = signal(false);
  isDeleteBoardOpen = signal(false);
  isEditTaskOpen = signal(false);
  isDeleteTaskOpen = signal(false);

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

  openTaskForm() {
    this.isTaskFormOpen.set(true);
  }
  closeTaskForm() {
    this.isTaskFormOpen.set(false);
  }

  editBoard(boardIndex: number, name: string, columns: { name: string }[]) {
    this._boards.update((boards) => {
      const board = boards[boardIndex];
      board.name = name;

      board.columns = columns.map((col) => {
        const existing = board.columns.find((c: any) => c.name === col.name);
        return existing ?? { name: col.name, tasks: [] };
      });

      return [...boards];
    });
    this.save();
  }

  deleteBoard(boardIndex: number) {
    this._boards.update((boards) => boards.filter((_, i) => i !== boardIndex));
    this.save();
  }

  editTask(boardIndex: number, columnName: string, taskIndex: number, updatedTask: any) {
    this._boards.update((boards) => {
      const column = boards[boardIndex].columns.find((c: any) => c.name === columnName);
      if (column) column.tasks[taskIndex] = updatedTask;
      return [...boards];
    });
    this.save();
  }

  deleteTask(boardIndex: number, columnName: string, taskIndex: number) {
    this._boards.update((boards) => {
      const column = boards[boardIndex].columns.find((c: any) => c.name === columnName);
      if (column) column.tasks.splice(taskIndex, 1);
      return [...boards];
    });
    this.save();
  }

  openEditBoard() {
    this.isEditBoardOpen.set(true);
  }
  closeEditBoard() {
    this.isEditBoardOpen.set(false);
  }
  openDeleteBoard() {
    this.isDeleteBoardOpen.set(true);
  }
  closeDeleteBoard() {
    this.isDeleteBoardOpen.set(false);
  }
  openEditTask() {
    this.isEditTaskOpen.set(true);
  }
  closeEditTask() {
    this.isEditTaskOpen.set(false);
  }
  openDeleteTask() {
    this.isDeleteTaskOpen.set(true);
  }
  closeDeleteTask() {
    this.isDeleteTaskOpen.set(false);
  }

  saveBoard(boardIndex: number, board: any) {
    this._boards.update((boards) => {
      boards[boardIndex] = board;
      return [...boards];
    });
    this.save();
  }
}
