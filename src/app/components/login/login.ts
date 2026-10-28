import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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
  passwordFieldType: 'password' | 'text' = 'password';

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
      .subscribe({
        next: (res) => {
          const token = res.data?.token;
          if (token) {
            this.auth.saveToken(token);
            this.auth.saveUserEmail(this.email);
            this.router.navigate(['/adminPanel']);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Giriş Başarısız',
              text: 'E-posta veya şifre hatalı.',
              confirmButtonColor: '#e0cf95',
            });
          }
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Giriş Başarısız',
            text: 'Sunucu ile bağlantı kurulamadı veya bilgiler hatalı.',
            confirmButtonColor: '#e0cf95',
          });
        },
      });
  }

  togglePassword() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
