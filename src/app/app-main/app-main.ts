import { BoardService } from './../services/board';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompletedSubtasksPipe } from '../pipes/completed-subtasks-pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main',
  host: { class: 'block flex-1 overflow-auto' },
  imports: [CompletedSubtasksPipe, FormsModule],
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

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.boardIndex = Number(params['index']);
      this.board = this.boardService.getBoardByIndex(this.boardIndex);
      this.newTaskStatus = this.board?.columns[0]?.name ?? '';
    });
  }

  openTask(task: any) {
    this.selectedTask = task;
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
    if (!this.newColumnName.trim()) return;
    this.boardService.addColumn(this.boardIndex, this.newColumnName.trim());
    this.board = this.boardService.getBoardByIndex(this.boardIndex);
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
    this.handleTaskFormClose();
  }
}
