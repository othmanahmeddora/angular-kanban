import { BoardService } from './../services/board';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompletedSubtasksPipe } from '../pipes/completed-subtasks-pipe';
import { FormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDropList,
  CdkDrag,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-main',
  host: { class: 'block flex-1 overflow-auto' },
  imports: [CompletedSubtasksPipe, FormsModule, CdkDropList, CdkDrag],
  templateUrl: './app-main.html',
  styleUrl: './app-main.css',
})
export class AppMain implements OnInit {
  private route = inject(ActivatedRoute);
  boardService = inject(BoardService);

  board: any = null;
  boardIndex = 0;
  selectedTask: any = null;

  isColumnFormOpen = false;
  newColumnName = '';

  newTaskTitle = '';
  newTaskDescription = '';
  newTaskStatus = '';
  newTaskSubtasks: string[] = [''];

  isColumnFormSubmitted = false;
  isTaskFormSubmitted = false;
  isEditTaskFormSubmitted = false;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['index'] !== undefined) {
        this.boardIndex = Number(params['index']);
        this.board = this.boardService.getBoardByIndex(this.boardIndex) ?? null;
        this.newTaskStatus = this.board?.columns[0]?.name ?? '';
      } else {
        const boards = this.boardService.getBoards();
        if (boards.length > 0) {
          this.boardIndex = 0;
          this.board = this.boardService.getBoardByIndex(0);
          this.newTaskStatus = this.board?.columns[0]?.name ?? '';
        }
      }
    });
  }

  closeTask() {
    this.selectedTask = null;
  }
  toggleSubtask(subtask: any) {
    subtask.isCompleted = !subtask.isCompleted;
  }

  handleColumnFormOpen() {
    this.isColumnFormOpen = true;
  }
  handleColumnFormClose() {
    this.isColumnFormOpen = false;
    this.newColumnName = '';
  }

  submitColumn() {
    this.isColumnFormSubmitted = true;
    if (!this.newColumnName.trim()) return;
    this.boardService.addColumn(this.boardIndex, this.newColumnName.trim());
    this.board = this.boardService.getBoardByIndex(this.boardIndex);
    this.isColumnFormSubmitted = false;
    this.handleColumnFormClose();
  }

  handleTaskFormClose() {
    this.boardService.closeTaskForm();
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskStatus = this.board?.columns[0]?.name ?? '';
    this.newTaskSubtasks = [''];
  }

  addSubtaskField() {
    this.newTaskSubtasks.push('');
  }
  removeSubtaskField(index: number) {
    this.newTaskSubtasks.splice(index, 1);
  }

  submitTask() {
    this.isTaskFormSubmitted = true;
    if (!this.newTaskTitle.trim()) return;
    const task = {
      title: this.newTaskTitle.trim(),
      description: this.newTaskDescription.trim(),
      status: this.newTaskStatus,
      subtasks: this.newTaskSubtasks
        .filter((s) => s.trim())
        .map((s) => ({ title: s.trim(), isCompleted: false })),
    };
    this.boardService.addTask(this.boardIndex, this.newTaskStatus, task);
    this.board = this.boardService.getBoardByIndex(this.boardIndex);
    this.isTaskFormSubmitted = false;
    this.handleTaskFormClose();
  }

  selectedTaskIndex = -1;
  selectedTaskColumn = '';
  isTaskMenuOpen = false;

  editTaskTitle = '';
  editTaskDescription = '';
  editTaskStatus = '';
  editTaskSubtasks: { title: string; isCompleted: boolean }[] = [];

  openTask(task: any, columnName: string, taskIndex: number) {
    this.selectedTask = task;
    this.selectedTaskIndex = taskIndex;
    this.selectedTaskColumn = columnName;
  }

  openEditTask() {
    this.editTaskTitle = this.selectedTask.title;
    this.editTaskDescription = this.selectedTask.description;
    this.editTaskStatus = this.selectedTask.status;
    this.editTaskSubtasks = [...this.selectedTask.subtasks.map((s: any) => ({ ...s }))];
    this.boardService.openEditTask();
  }

  addEditSubtask() {
    this.editTaskSubtasks.push({ title: '', isCompleted: false });
  }
  removeEditSubtask(i: number) {
    this.editTaskSubtasks.splice(i, 1);
  }

  submitEditTask() {
    this.isEditTaskFormSubmitted = true;
    if (!this.editTaskTitle.trim()) return;
    const updated = {
      title: this.editTaskTitle.trim(),
      description: this.editTaskDescription.trim(),
      status: this.editTaskStatus,
      subtasks: this.editTaskSubtasks.filter((s) => s.title.trim()),
    };

    if (this.editTaskStatus !== this.selectedTaskColumn) {
      this.boardService.deleteTask(
        this.boardIndex,
        this.selectedTaskColumn,
        this.selectedTaskIndex,
      );
      this.boardService.addTask(this.boardIndex, this.editTaskStatus, updated);
    } else {
      this.boardService.editTask(
        this.boardIndex,
        this.selectedTaskColumn,
        this.selectedTaskIndex,
        updated,
      );
    }

    this.board = this.boardService.getBoardByIndex(this.boardIndex);
    this.selectedTask = updated;
    this.selectedTaskColumn = this.editTaskStatus;
    this.isEditTaskFormSubmitted = false;
    this.boardService.closeEditTask();
  }

  confirmDeleteTask() {
    this.boardService.deleteTask(this.boardIndex, this.selectedTaskColumn, this.selectedTaskIndex);
    this.board = this.boardService.getBoardByIndex(this.boardIndex);
    this.boardService.closeDeleteTask();
    this.closeTask();
  }

  dropTask(event: CdkDragDrop<any[]>, boardIndex: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const task = event.container.data[event.currentIndex];
      task.status = event.container.id;
    }

    this.boardService.saveBoard(this.boardIndex, this.board);
  }

  getColumnIds(): string[] {
    return this.board?.columns.map((col: any) => col.name) ?? [];
  }
}
