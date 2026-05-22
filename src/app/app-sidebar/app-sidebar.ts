import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  host: { class: 'block w-[16rem] shrink-0 h-full' },
  imports: [],
  templateUrl: './app-sidebar.html',
  styleUrl: './app-sidebar.css',
})
export class AppSidebar {
  isDark = true;

  toggleTheme() {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark', this.isDark);
  }
}
