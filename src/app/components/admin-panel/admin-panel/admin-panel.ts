import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {
  tabs: TABS[] = [
    { title: 'navbar', url: 'navbar' },
    { title: 'slider', url: 'slider' },
    { title: 'news', url: 'news' },
    { title: 'aboutUs', url: 'aboutUs' },
    { title: 'footer', url: 'footer' },
    { title: 'forms', url: 'forms' },
    { title: 'blogs', url: 'blogs' },
  ];
}

export interface TABS {
  title: string;
  url: string;
}
