import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarService } from '../../../services/navbar-service';
import { navbarModel } from '../../../model/navbar.model';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  readonly navbarService = inject(NavbarService);
  navbar: navbarModel[] = [];

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.navbarService.getnavbar().subscribe(
      (resp) => {
        console.log(resp);
        if (resp.success && Array.isArray(resp.data)) {
          this.navbar = resp.data;
        }
      },
      (err) => {
        console.error('Veri çekme hatası:', err);
      }
    );
  }
}
