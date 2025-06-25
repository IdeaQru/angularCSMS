import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../services/user.model';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error = '';
  success = '';

  formUser: Partial<User> = {};
  isEdit = false;
  showForm = false; // <-- Tambahkan ini

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: users => {
        this.users = users;
        this.loading = false;
      },
      error: err => {
        this.error = 'Gagal memuat data user';
        this.loading = false;
      }
    });
  }

  startAdd() {
    this.formUser = {};
    this.isEdit = false;
    this.error = '';
    this.success = '';
    this.showForm = true; // <-- Tampilkan form
  }

  startEdit(user: User) {
    this.formUser = { ...user };
    this.isEdit = true;
    this.error = '';
    this.success = '';
    this.showForm = true; // <-- Tampilkan form
  }

  saveUser() {
    if (this.isEdit && this.formUser._id) {
      this.userService.update(this.formUser._id, this.formUser).subscribe({
        next: () => {
          this.success = 'User berhasil diupdate';
          this.loadUsers();
          this.formUser = {};
          this.isEdit = false;
          this.showForm = false; // <-- Sembunyikan form
        },
        error: () => this.error = 'Gagal update user'
      });
    } else {
      this.userService.create(this.formUser).subscribe({
        next: () => {
          this.success = 'User berhasil ditambahkan';
          this.loadUsers();
          this.formUser = {};
          this.showForm = false; // <-- Sembunyikan form
        },
        error: () => this.error = 'Gagal tambah user'
      });
    }
  }

  deleteUser(id: string) {
    if (!confirm('Yakin hapus user ini?')) return;
    this.userService.delete(id).subscribe({
      next: () => {
        this.success = 'User berhasil dihapus';
        this.loadUsers();
      },
      error: () => this.error = 'Gagal hapus user'
    });
  }

  cancelForm() {
    this.formUser = {};
    this.isEdit = false;
    this.error = '';
    this.success = '';
    this.showForm = false; // <-- Sembunyikan form
  }
  resetUser: User | null = null;
resetPasswordValue = '';

openResetPassword(user: User) {
  this.resetUser = user;
  console.log('User yang akan direset password:', this.resetUser);
  this.resetPasswordValue = '';
  this.error = '';
  this.success = '';
}

cancelResetPassword() {
  this.resetUser = null;
  this.resetPasswordValue = '';
}

resetPassword() {
  if (!this.resetUser) return;
  if (!this.resetPasswordValue) {
    this.error = 'Password baru wajib diisi';
    return;
  }
  this.userService.resetPassword(this.resetUser?._id, this.resetPasswordValue).subscribe({
    next: () => {
      this.success = 'Password berhasil direset';
      this.resetUser = null;
      this.resetPasswordValue = '';
      this.loadUsers();
    },
    error: () => this.error = 'Gagal reset password'
  });
}

}
