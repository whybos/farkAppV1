import { Routes } from '@angular/router';
import { aboutUs,  } from './components/aboutUs/aboutUs';
import { Main } from './components/main/main';
import { News } from './components/news/news';
import { Query } from './components/query/query';
import { Blog } from './components/blog/blog';
import { NewsDetail } from './components/newsDetail/newsDetail';
import { Contact } from './components/contact/contact';

export const routes: Routes = [
    {path:"",pathMatch:"full",redirectTo:"main"},
    {path:"main",component:Main},
    {path:"news",component:News},
    {path:"aboutUs",component:aboutUs},
    {path:"blog",component:Blog},
    {path:"query",component:Query},
    {path:"contact",component:Contact},
    {path:"news/detail/:id",component:NewsDetail}
];

