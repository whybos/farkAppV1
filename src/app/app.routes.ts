import { Routes } from '@angular/router';
import { aboutUs } from './components/aboutUs/aboutUs';
import { Main } from './components/main/main';
import { News } from './components/news/news';
import { Query } from './components/query/query';
import { Blog } from './components/blog/blog';
import { NewsDetail } from './components/newsDetail/newsDetail';
import { Contact } from './components/contact/contact';
import { adminGuard } from './guards/adminPanel.guard';
import { Login } from './components/login/login';
import { AdminPanel } from './components/admin-panel/admin-panel/admin-panel';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'main' },
  { path: 'main', component: Main },
  { path: 'news', component: News },
  { path: 'aboutUs', component: aboutUs },
  { path: 'blog', component: Blog },
  { path: 'query', component: Query },
  { path: 'contact', component: Contact },
  { path: 'news/detail/:id', component: NewsDetail },
  { path: 'login', component: Login },

  {
    path: 'adminPanel',
    loadChildren: () =>
      import('../app/components/admin-panel/admin-panel/admin.routes').then(
        (m) => m.adminRoutes
      ),
    canActivate: [AdminGuard],
    canActivateChild: [AdminGuard],
  },
  { path: '**', redirectTo: '' },
];
