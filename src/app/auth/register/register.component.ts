import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { authAnimations } from '../auth.animations';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: authAnimations
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  error = '';
  success = '';

  constructor(private router: Router, private auth: AuthService) { }

  onSubmit() {
    this.auth.register(this.username, this.password).subscribe({
      next: (res) => {
        this.success = 'Pendaftaran berhasil!';
      },
      error: (err) => {
        this.error = err.error?.error || 'Pendaftaran gagal';
      }
    });
  }
}
