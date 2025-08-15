import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../services/news-service';
import { SliderService } from '../../services/slider-service';
import { newsModel } from '../../model/news.model';
import { sliderModel } from '../../model/slider.model';
import { aboutUsModel } from '../../model/aboutUs.model';
import { aboutUsService } from '../../services/aboutUs-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './main.html',
  styleUrls: ['./main.css'],
})
export class Main implements AfterViewInit {
  readonly newsService = inject(NewsService);
  readonly sliderService = inject(SliderService);
  readonly aboutUsService = inject(aboutUsService);

  mainnews: newsModel[] = [];
  slider: sliderModel[] = [];
  aboutUs: aboutUsModel[] = [];

  @ViewChildren('animItem') animItems!: QueryList<ElementRef>;

  ngOnInit(): void {
    this.getData();
    this.getSlides();
    this.getaboutUs();
  }

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    this.animItems.forEach((el) => {
      observer.observe(el.nativeElement);
    });
  }

  getData(): void {
    this.newsService.getNews().subscribe((resp) => {
      if (resp.success && Array.isArray(resp.data)) {
        const sorted = [...resp.data].sort((a, b) => b.id - a.id);
        this.mainnews = sorted.slice(0, 2);
      }
    });
  }

  getSlides(): void {
    this.sliderService.getSlider().subscribe(
      (resp) => {
        if (resp.success && Array.isArray(resp.data)) {
          this.slider = resp.data.sort((a, b) => b.id - a.id);
        }
      },
      (err) => {
        console.error('Veri çekme hatası:', err);
      }
    );
  }

  getaboutUs(): void {
    this.aboutUsService.getaboutUs().subscribe(
      (resp) => {
        if (resp.success && Array.isArray(resp.data)) {
          const topItem = resp.data.reduce((prev, curr) =>
            curr.id > prev.id ? curr : prev
          );
          this.aboutUs = [topItem];
        }
      },
      (err) => {
        console.error('Veri çekme hatası:', err);
      }
    );
  }
}
