import { Injectable } from '@angular/core';
import data from '../../../data.json';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private boards = data.boards;

  getBoards() {
    return this.boards;
  }

  getBoardByIndex(index: number) {
    return this.boards[index];
  }
}
