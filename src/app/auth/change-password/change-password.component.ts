import { Component } from '@angular/core';
// Ganti AuthService dengan UserService
import { AuthService } from '../../services/auth.service'; // Pastikan path ini benar

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  error = '';
  success = '';
  isLoading = false;

  // Ganti AuthService menjadi UserService
  constructor(private authService: AuthService) {}

  onSubmit() {
    this.error = '';
    this.success = '';
    this.isLoading = true;

    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.error = 'Semua field wajib diisi';
      this.isLoading = false;
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Password baru dan konfirmasi tidak cocok';
      this.isLoading = false;
      return;
    }

    // Panggil metode dari userService
    this.authService.changePassword({ 
      oldPassword: this.oldPassword, 
      newPassword: this.newPassword 
    }).subscribe({
      next: (res:any) => {
        this.isLoading = false;
        this.success = res.message || 'Password berhasil diganti!';
        // Kosongkan form setelah berhasil
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err:any) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Gagal mengganti password. Periksa kembali password lama Anda.';
      }
    });
  }
}
