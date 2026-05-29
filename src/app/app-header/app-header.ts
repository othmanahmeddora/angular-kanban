import { Component, inject } from '@angular/core';
import { BoardService } from '../services/board';

@Component({
  selector: 'app-header',
  host: { class: 'block' },
  imports: [],
  templateUrl: './app-header.html',
  styleUrl: './app-header.css',
})
export class AppHeader {
  boardService = inject(BoardService);
}
