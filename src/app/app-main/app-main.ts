import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  host: { class: 'block flex-1' },
  imports: [],
  templateUrl: './app-main.html',
  styleUrl: './app-main.css',
})
export class AppMain {
  isClicked = false;

  handleColumnFormOpen() {
    this.isClicked = true;
  }

  handleColumnFormClose() {
    this.isClicked = false;
  }
}
