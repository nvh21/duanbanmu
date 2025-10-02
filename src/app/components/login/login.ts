import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

interface LoginData {
  username: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  loginData: LoginData = {
    username: '',
    password: '',
    rememberMe: false,
  };

  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (this.isLoading) return;

    console.log('Attempting login with:', this.loginData);
    this.isLoading = true;
    this.errorMessage = '';

    this.authService
      .login(this.loginData.username, this.loginData.password, this.loginData.rememberMe)
      .subscribe({
        next: (success: boolean) => {
          console.log('Login result:', success);
          if (success) {
            console.log('Login successful, navigating to dashboard');
            this.router.navigate(['/dashboard']);
          } else {
            console.log('Login failed - invalid credentials');
            this.errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng!';
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Login error:', error);
          this.errorMessage = 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại!';
          this.isLoading = false;
        },
      });
  }
}
