import { Routes } from '@angular/router';
import { AdminNavbar } from '../adminPages/admin-navbar/admin-navbar';
import { AdminSlider } from '../adminPages/admin-slider/admin-slider';
import { AdminNews } from '../adminPages/admin-news/admin-news';
import { AdminPanel } from './admin-panel';
import { AdminAboutUs } from '../adminPages/admin-about-us/admin-about-us';
import { AdminFooter } from '../adminPages/admin-footer/admin-footer';
import { AdminForms } from '../adminPages/admin-forms/admin-forms';
import { AdminBlog } from '../adminPages/admin-blog/admin-blog';
import { AdminNewsDetail } from '../adminPages/admin-news-detail/admin-news-detail';
import { AdminAddUser } from '../adminPages/admin-add-user/admin-add-user';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminPanel,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'navbar' },
      { path: 'navbar', component: AdminNavbar },
      { path: 'slider', component: AdminSlider },
      { path: 'news', component: AdminNews },
      { path: 'aboutUs', component: AdminAboutUs },
      { path: 'footer', component: AdminFooter },
      { path: 'forms', component: AdminForms },
      { path: 'blogs', component: AdminBlog },
      { path: 'news/:id', component: AdminNewsDetail },
      { path: 'addUser', component: AdminAddUser },
    ],
  },
];
