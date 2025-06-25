import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { authAnimations } from '../auth.animations';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: authAnimations
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private router: Router,private auth : AuthService) {}

   onSubmit() {
    this.auth.login(this.username, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.error || 'Login gagal';
      }
    });
  }
}
