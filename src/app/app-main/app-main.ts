import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from '../services/board';

@Component({
  selector: 'app-main',
  host: { class: 'block flex-1' },
  imports: [],
  templateUrl: './app-main.html',
  styleUrl: './app-main.css',
})
export class AppMain {
  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);
  board: any = null;

  ngOnInit() {
    this.route.params.subscribe((param) => {
      const index = Number(param['index']);
      this.board = this.boardService.getBoardByIndex(index);
    });
  }

  getCompletedSubtasks(subtasks: { title: string; isCompleted: boolean }[]): number {
    return subtasks.filter((subtask) => subtask.isCompleted).length;
  }

  isClicked = false;

  handleColumnFormOpen() {
    this.isClicked = true;
  }

  handleColumnFormClose() {
    this.isClicked = false;
  }
}
