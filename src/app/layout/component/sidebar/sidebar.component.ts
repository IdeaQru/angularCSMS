import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Output() toggle = new EventEmitter<void>();
  isMinimized: boolean = false;

    toggleMinimize(): void {
      this.isMinimized = !this.isMinimized;
      this.toggle.emit();
    }
  
}
