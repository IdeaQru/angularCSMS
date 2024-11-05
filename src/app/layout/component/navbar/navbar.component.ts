import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMinimized: boolean = false;
  sidebarToggleListener: any;

  ngOnInit(): void {
    // Mendengarkan event untuk toggle sidebar
    this.sidebarToggleListener = (event: any) => {
      this.isMinimized = event.detail.isMinimized;
    };
    window.addEventListener('sidebarToggle', this.sidebarToggleListener);
  }

  ngOnDestroy(): void {
    // Menghapus event listener ketika komponen dihapus
    window.removeEventListener('sidebarToggle', this.sidebarToggleListener);
  }
}
