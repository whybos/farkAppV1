import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../services/news-service';
import { SliderService } from '../../services/slider-service';
import { newsModel } from '../../model/news.model';
import { sliderModel } from '../../model/slider.model'; // <-- EKLENDİ
import { aboutUsModel } from '../../model/aboutUs.model';
import { aboutUsService } from '../../services/aboutUs-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [RouterLink, CommonModule],
  templateUrl: './main.html',
  styleUrls: ['./main.css'],
})
export class Main implements OnInit {
  readonly newsService = inject(NewsService);
  readonly sliderService = inject(SliderService);
  readonly aboutUsService = inject(aboutUsService);

  mainnews: newsModel[] = [];
  slider: sliderModel[] = []; // <-- string[] yerine sliderModel[]
  aboutUs: aboutUsModel[] = [];
  ngOnInit(): void {
    this.getData();
    this.getSlides();
    this.getaboutUs();
  }

  getData(): void {
    this.newsService.getNews().subscribe((resp) => {
      if (resp.success && Array.isArray(resp.data)) {
        const sorted = [...resp.data].sort((a, b) => b.id - a.id); // id'ye göre azalan sırala
        const topTwo = sorted.slice(0, 2); // son 2 veriyi al (id'si en büyük olanlar)
        this.mainnews = topTwo; // zaten sıralı halde
      }
    });
  }

  getSlides(): void {
    this.sliderService.getSlider().subscribe(
      (resp) => {
        console.log(resp);
        if (resp.success && Array.isArray(resp.data)) {
          this.slider = resp.data;
        }
      },
      (err) => {
        console.error('Veri çekme hatası:', err);
      }
    );
  }

  getaboutUs(): void {
    this.aboutUsService.getaboutUs().subscribe((resp) => {
      console.log('aboutUs data:', resp.data);
      if (resp.success && Array.isArray(resp.data)) {
        this.aboutUs = resp.data;
      }
    });
  }
}
