import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Bootstrap modal tipi import
declare var bootstrap: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {
  email = '';
  password = '';
  passwordFieldType: 'password' | 'text' = 'password'; // başlangıçta gizli

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit() {
    const modalElement = document.getElementById('adminAlertModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  onLogin() {
    this.auth
      .login({ email: this.email, password: this.password })
      .subscribe((res) => {
        const token = res.data?.token;
        if (token) {
          this.auth.saveToken(token);
          this.router.navigate(['/adminPanel']);
        } else {
          alert('Giriş başarısız');
        }
      });
  }

  togglePassword() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
