import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavbarService } from '../../../services/navbar-service';
import { navbarModel } from '../../../model/navbar.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements OnInit {
  readonly navbarService = inject(NavbarService);
  navbar: navbarModel[] = [];
  readonly router = inject(Router);

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.navbarService.getnavbar().subscribe(
      (resp) => {
        if (resp.success && Array.isArray(resp.data)) {
          this.navbar = resp.data;
        }
      },
      (err) => {
        console.error('Veri çekme hatası:', err);
      }
    );
  }

  closeOffcanvas() {
    // Offcanvas elementini seç
    const offcanvasEl = document.getElementById('offcanvas');
    if (offcanvasEl) {
      // Bootstrap Offcanvas instance'ını al
      const offcanvasInstance = (
        window as any
      ).bootstrap?.Offcanvas.getInstance(offcanvasEl);
      if (offcanvasInstance) {
        offcanvasInstance.hide();
      }
    }
  }

  checkLogin() {
    let login = localStorage.getItem('token');

    if (login != undefined) {
      return true;
    }
    return false;
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
