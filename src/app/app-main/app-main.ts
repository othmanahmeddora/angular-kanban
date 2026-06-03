import { BoardService } from './../services/board';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompletedSubtasksPipe } from '../pipes/completed-subtasks-pipe';
import { FormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDropList,
  CdkDrag,
  CdkDragPlaceholder,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-main',
  host: { class: 'block flex-1 overflow-auto' },
  imports: [CompletedSubtasksPipe, FormsModule, CdkDropList, CdkDrag, CdkDragPlaceholder],
  templateUrl: './app-main.html',
  styleUrl: './app-main.css',
})
export class AppMain implements OnInit {
  private route = inject(ActivatedRoute);
  boardService = inject(BoardService);

  boardIndex = signal(0);
  board = computed(() => this.boardService.getBoardByIndex(this.boardIndex()));
  selectedTaskIndex = signal(-1);
  selectedTaskColumn = signal('');

  isColumnFormOpen = false;
  newColumnName = '';
  newTaskTitle = '';
  newTaskDescription = '';
  newTaskStatus = '';
  newTaskSubtasks: string[] = [''];
  isColumnFormSubmitted = false;
  isTaskFormSubmitted = false;
  isEditTaskFormSubmitted = false;
  isTaskMenuOpen = false;
  editTaskTitle = '';
  editTaskDescription = '';
  editTaskStatus = '';
  editTaskSubtasks: { title: string; isCompleted: boolean }[] = [];

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['index'] !== undefined) {
        this.boardIndex.set(Number(params['index']));
      } else {
        const boards = this.boardService.getBoards();
        if (boards.length > 0) this.boardIndex.set(0);
      }
      this.newTaskStatus = this.board()?.columns[0]?.name ?? '';
    });
  }

  get selectedTask() {
    if (this.selectedTaskIndex() === -1) return null;
    const column = this.board()?.columns.find((col: any) => col.name === this.selectedTaskColumn());
    return column?.tasks[this.selectedTaskIndex()] ?? null;
  }

  openTask(task: any, columnName: string, taskIndex: number) {
    this.selectedTaskColumn.set(columnName);
    this.selectedTaskIndex.set(taskIndex);
  }

  closeTask() {
    this.selectedTaskIndex.set(-1);
    this.selectedTaskColumn.set('');
    this.isTaskMenuOpen = false;
  }

  toggleSubtask(subtaskIndex: number) {
    this.boardService.toggleSubtask(
      this.boardIndex(),
      this.selectedTaskColumn(),
      this.selectedTaskIndex(),
      subtaskIndex,
    );
  }

  handleColumnFormOpen() {
    this.isColumnFormOpen = true;
  }

  handleColumnFormClose() {
    this.isColumnFormOpen = false;
    this.newColumnName = '';
    this.isColumnFormSubmitted = false;
  }

  submitColumn() {
    this.isColumnFormSubmitted = true;
    if (!this.newColumnName.trim()) return;
    this.boardService.addColumn(this.boardIndex(), this.newColumnName.trim());
    this.isColumnFormSubmitted = false;
    this.handleColumnFormClose();
  }

  handleTaskFormClose() {
    this.boardService.closeTaskForm();
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskStatus = this.board()?.columns[0]?.name ?? '';
    this.newTaskSubtasks = [''];
    this.isTaskFormSubmitted = false;
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
    this.boardService.addTask(this.boardIndex(), this.newTaskStatus, task);
    this.isTaskFormSubmitted = false;
    this.handleTaskFormClose();
  }

  openEditTask() {
    const task = this.selectedTask;
    if (!task) return;
    this.editTaskTitle = task.title;
    this.editTaskDescription = task.description;
    this.editTaskStatus = task.status;
    this.editTaskSubtasks = task.subtasks.map((s: any) => ({ ...s }));
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

    if (this.editTaskStatus !== this.selectedTaskColumn()) {
      this.boardService.deleteTask(
        this.boardIndex(),
        this.selectedTaskColumn(),
        this.selectedTaskIndex(),
      );
      this.boardService.addTask(this.boardIndex(), this.editTaskStatus, updated);
      this.selectedTaskColumn.set(this.editTaskStatus);
    } else {
      this.boardService.editTask(
        this.boardIndex(),
        this.selectedTaskColumn(),
        this.selectedTaskIndex(),
        updated,
      );
    }

    this.isEditTaskFormSubmitted = false;
    this.boardService.closeEditTask();
  }

  confirmDeleteTask() {
    this.boardService.deleteTask(
      this.boardIndex(),
      this.selectedTaskColumn(),
      this.selectedTaskIndex(),
    );
    this.boardService.closeDeleteTask();
    this.closeTask();
  }

  dropTask(event: CdkDragDrop<any[]>) {
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
    this.boardService.saveBoard(this.boardIndex(), this.board());
  }

  getColumnIds(): string[] {
    return this.board()?.columns.map((col: any) => col.name) ?? [];
  }
}
