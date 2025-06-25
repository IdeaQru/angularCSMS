import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service'; // Pastikan path benar

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Output() toggle = new EventEmitter<void>();
  isMinimized: boolean = false;
  role: string | null = null;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.role = this.auth.getRole();
  }

  toggleMinimize(): void {
    this.isMinimized = !this.isMinimized;
    this.toggle.emit();
  }
}
