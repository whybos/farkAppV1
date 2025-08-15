import { Component, inject, OnInit } from '@angular/core';
import { newsModel } from '../../../../model/news.model';
import { NewsService } from '../../../../services/news-service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { newsDetailService } from '../../../../services/newsDetail-service';
import { newsDetailModel } from '../../../../model/newsDetail.model';

@Component({
  selector: 'app-admin-news',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-news.html',
  styleUrl: './admin-news.css',
})
export class AdminNews implements OnInit {
  readonly newsService = inject(NewsService);
  readonly detailService = inject(newsDetailService);
  readonly router = inject(Router);
  news: newsModel[] = [];
  detail: newsDetailModel = {};
  myForm: FormGroup;
  isNew = true;
  selectedItem?: newsModel;
  modalInstance: any;
  id: number = 0;
  detailId: any;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      title: ['', Validators.required],
      summary: [''],
      photo: ['', Validators.required],
      date: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.getData();

    const modalEl = document.getElementById('updateModal');
    if (modalEl) {
      // @ts-ignore
      this.modalInstance = new bootstrap.Modal(modalEl);
    }
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

  getDetailData(id: number) {
    this.detailService.getDetail(id).subscribe((resp) => {
      console.log(resp);
      this.detail = resp.data;
    });
  }

  onNew() {
    this.isNew = true;
    this.selectedItem = undefined;
    this.myForm.reset();
    this.modalInstance?.show();
  }
  onUpdate(item: newsModel) {
    this.isNew = false;
    this.selectedItem = item;
    this.myForm.patchValue({
      title: item.title,
      summary: item.summary,
      photo: item.photo,
      date: item.date,
    });
    this.modalInstance.show();
  }

  onDelete(id: number): void {
    if (confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) {
      this.newsService.deleteNews(id).subscribe(() => {
        this.detailService.deleteDetail(id).subscribe();
        this.getData();
      });
    }
  }

  saveUpdate(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    const formData = this.myForm.value;

    if (this.isNew) {
      this.newsService.createNews(formData).subscribe(() => {
        this.getData();
        this.modalInstance?.hide();
      });
    } else if (this.selectedItem) {
      this.newsService
        .updateNews({ ...this.selectedItem, ...formData })
        .subscribe(() => {
          this.getData();
          this.modalInstance?.hide();
        });
    }
  }
  goToDetail(id: number) {
    this.router.navigate(['/adminPanel/news', id]);
  }
}
