import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-auditor-profile',
  templateUrl: './auditor-profile.component.html',
  styleUrls: ['./auditor-profile.component.css']
})
export class AuditorProfileComponent implements OnInit {
  auditor = {
    Nama: '',
    Jabatan: '',
    Lembaga_Audit: '',
  };
  loading = false;
  success = '';
  error = '';
  isSubmitted = false;

  constructor(private userService: UserService,private authService: AuthService) {}

  ngOnInit(): void {
    this.checkAuditorProfile();
  }

  checkAuditorProfile() {
    this.loading = true;
    this.userService.getAuditorProfile().subscribe({
      next: (data) => {
        if (data) {
          this.auditor = data;
          this.isSubmitted = true; // Sudah pernah submit, disable form
        }
        this.loading = false;
      },
      error: (err) => {
        // Jika error 404, berarti belum pernah submit, form tetap aktif
        this.loading = false;
      }
    });
  }

onSubmit() {
  this.success = '';
  this.error = '';
  this.loading = true;
  const userId = this.authService.getUserId();
  this.userService.createAuditor({
    Nama: this.auditor.Nama,
    Jabatan: this.auditor.Jabatan,
    Lembaga_Audit: this.auditor.Lembaga_Audit,
    userId // <-- tambahkan userId di sini
  }).subscribe({
    next: () => {
      this.success = 'Auditor berhasil ditambahkan!';
      this.isSubmitted = true;
      this.loading = false;
    },
    error: (err) => {
      this.error = err.error?.error || 'Gagal menambah auditor';
      this.loading = false;
      console.error(err);
    }
  });
}

}
