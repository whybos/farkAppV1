import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NewsService } from '../../services/news-service';
import { newsModel } from '../../model/news.model';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './news.html',
  styleUrls: ['./news.css'],
})
export class News implements OnInit {
  readonly newsService = inject(NewsService);
  news: newsModel[] = [];

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.newsService.getNews().subscribe(
      (resp) => {
        console.log('Gelen veri:', resp);

        if (resp.success && Array.isArray(resp.data)) {
          // En büyük ID’li haberi bul
          this.news = [...resp.data].sort((a, b) => b.id - a.id);
        }
      },
      (err) => {
        console.error('Veri çekme hatası:', err);
      }
    );
  }
}
