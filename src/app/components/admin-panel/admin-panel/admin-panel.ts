import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel implements OnInit {
  tabs: TABS[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const role = this.authService.getRole();

    // Ortak sekmeler
    this.tabs = [
      { title: 'navbar', url: 'navbar' },
      { title: 'slider', url: 'slider' },
      { title: 'news', url: 'news' },
      { title: 'aboutUs', url: 'aboutUs' },
      { title: 'footer', url: 'footer' },
      { title: 'forms', url: 'forms' },
      { title: 'blogs', url: 'blogs' },
    ];
    if (role === 'superAdmin') {
      this.tabs.push({ title: 'addUser', url: 'addUser' });
    }
  }
}

export interface TABS {
  title: string;
  url: string;
}
