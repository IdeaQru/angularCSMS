import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private auth: AuthService) {}
  isMinimized: boolean = false;
  sidebarToggleListener: any;
 logout() {
    this.auth.logout(); // Hapus token dari localStorage
    this.router.navigate(['/auth/login']);
  }
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
