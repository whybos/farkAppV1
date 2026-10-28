import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth-service';
import { UserService } from '../../../services/user-service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);

  tabs: TABS[] = [];
  isResetting = signal(false);

  ngOnInit(): void {
    const role = this.authService.getRole();

    this.tabs = [
      { title: 'Navbar', url: 'navbar' },
      { title: 'Slider', url: 'slider' },
      { title: 'Haberler', url: 'news' },
      { title: 'Hakkımızda', url: 'aboutUs' },
      { title: 'Footer', url: 'footer' },
      { title: 'Formlar', url: 'forms' },
      { title: 'Haftalık Bilgi', url: 'blogs' },
      { title: "FARK'ında", url: 'farkinda' },
    ];
    if (role === 'superAdmin') {
      this.tabs.push({ title: 'Kullanıcı Ekle', url: 'addUser' });
    }
  }

  resetDatabase(): void {
    Swal.fire({
      icon: 'warning',
      title: 'Veritabanını Sıfırla',
      text: 'Veritabanındaki tüm kayıtlar kalıcı olarak sıfırlanacak. Emin misiniz?',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#52525b',
      confirmButtonText: 'Evet, Sıfırla',
      cancelButtonText: 'İptal',
      color: '#f5f5f5',
      background: '#141414',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.isResetting.set(true);

      this.userService.resetDatabase().subscribe({
        next: () => {
          this.isResetting.set(false);
          Swal.fire({
            icon: 'success',
            title: 'Veritabanı Sıfırlandı',
            text: 'Veritabanı başarıyla sıfırlandı.',
            confirmButtonColor: '#2563eb',
            color: '#f5f5f5',
            background: '#141414',
          }).then(() => {
            window.location.reload();
          });
        },
        error: (err) => {
          this.isResetting.set(false);
          Swal.fire({
            icon: 'error',
            title: 'Hata',
            text:
              typeof err?.error === 'string' && err.error.length < 300
                ? err.error
                : 'Veritabanı sıfırlanırken bir sorun oluştu.',
            confirmButtonColor: '#dc2626',
            color: '#f5f5f5',
            background: '#141414',
          });
        },
      });
    });
  }
}

export interface TABS {
  title: string;
  url: string;
}
