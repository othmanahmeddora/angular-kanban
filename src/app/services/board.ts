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
        columns: columns.map((col, i) => ({
          name: col,
          tasks: [],
        })),
      },
    ]);
    this.save();
    return this._boards().length - 1;
  }

  addColumn(boardIndex: number, name: string) {
    this._boards.update((boards) =>
      boards.map((board, i) =>
        i === boardIndex
          ? {
              ...board,
              columns: [
                ...board.columns,
                {
                  name,
                  tasks: [],
                },
              ],
            }
          : board,
      ),
    );
    this.save();
  }

  addTask(boardIndex: number, columnName: string, task: any) {
    this._boards.update((boards) =>
      boards.map((board, i) =>
        i === boardIndex
          ? {
              ...board,
              columns: board.columns.map((col: any) =>
                col.name === columnName ? { ...col, tasks: [...col.tasks, task] } : col,
              ),
            }
          : board,
      ),
    );
    this.save();
  }

  editBoard(boardIndex: number, name: string, columns: { name: string }[]) {
    this._boards.update((boards) =>
      boards.map((board, i) => {
        if (i !== boardIndex) return board;
        return {
          ...board,
          name,
          columns: columns.map((col) => {
            const existing = board.columns.find((c: any) => c.name === col.name);
            return existing ?? { name: col.name, tasks: [] };
          }),
        };
      }),
    );
    this.save();
  }

  deleteBoard(boardIndex: number) {
    this._boards.update((boards) => boards.filter((_, i) => i !== boardIndex));
    this.save();
  }

  editTask(boardIndex: number, columnName: string, taskIndex: number, updatedTask: any) {
    this._boards.update((boards) =>
      boards.map((board, i) =>
        i === boardIndex
          ? {
              ...board,
              columns: board.columns.map((col: any) =>
                col.name === columnName
                  ? {
                      ...col,
                      tasks: col.tasks.map((task: any, ti: number) =>
                        ti === taskIndex ? updatedTask : task,
                      ),
                    }
                  : col,
              ),
            }
          : board,
      ),
    );
    this.save();
  }

  deleteTask(boardIndex: number, columnName: string, taskIndex: number) {
    this._boards.update((boards) =>
      boards.map((board, i) =>
        i === boardIndex
          ? {
              ...board,
              columns: board.columns.map((col: any) =>
                col.name === columnName
                  ? { ...col, tasks: col.tasks.filter((_: any, ti: number) => ti !== taskIndex) }
                  : col,
              ),
            }
          : board,
      ),
    );
    this.save();
  }

  toggleSubtask(boardIndex: number, columnName: string, taskIndex: number, subtaskIndex: number) {
    this._boards.update((boards) =>
      boards.map((board, i) =>
        i === boardIndex
          ? {
              ...board,
              columns: board.columns.map((col: any) =>
                col.name === columnName
                  ? {
                      ...col,
                      tasks: col.tasks.map((task: any, ti: number) =>
                        ti === taskIndex
                          ? {
                              ...task,
                              subtasks: task.subtasks.map((s: any, si: number) =>
                                si === subtaskIndex ? { ...s, isCompleted: !s.isCompleted } : s,
                              ),
                            }
                          : task,
                      ),
                    }
                  : col,
              ),
            }
          : board,
      ),
    );
    this.save();
  }

  saveBoard(boardIndex: number, board: any) {
    this._boards.update((boards) => boards.map((b, i) => (i === boardIndex ? board : b)));
    this.save();
  }

  isTaskFormOpen = signal(false);
  isEditBoardOpen = signal(false);
  isDeleteBoardOpen = signal(false);
  isEditTaskOpen = signal(false);
  isDeleteTaskOpen = signal(false);

  openTaskForm() {
    this.isTaskFormOpen.set(true);
  }

  closeTaskForm() {
    this.isTaskFormOpen.set(false);
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
}
