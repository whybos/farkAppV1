import { Component, inject, OnInit } from '@angular/core';
import { newsModel } from '../../../../model/news.model';
import { NewsService } from '../../../../services/news-service';
import { AuthService } from '../../../../services/auth-service';
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
import { ImageUpload } from '../../../global/image-upload/image-upload';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-news',
  imports: [ReactiveFormsModule, CommonModule, ImageUpload],
  templateUrl: './admin-news.html',
  styleUrl: './admin-news.css',
})
export class AdminNews implements OnInit {
  readonly newsService = inject(NewsService);
  readonly detailService = inject(newsDetailService);
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  news: newsModel[] = [];
  detail: newsDetailModel = {};
  myForm: FormGroup;
  isNew = true;
  selectedItem?: newsModel;
  modalInstance: any;
  id: number = 0;
  detailId: any;
  isSuperAdmin = false;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      title: ['', Validators.required],
      summary: [''],
      photo: ['', Validators.required],
      date: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.isSuperAdmin = this.authService.isSuperAdmin();
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
        if (resp.success && Array.isArray(resp.data)) {
          this.news = [...resp.data].sort((a, b) => b.id - a.id);
        } else {
          this.news = [];
        }
      },
      (err) => {
        console.error('Veri çekme hatası:', err);
      }
    );
  }

  getDetailData(id: number) {
    this.detailService.getDetail(id).subscribe((resp) => {
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
    this.modalInstance?.show();
  }

  onPhotoChange(base64: string): void {
    this.myForm.get('photo')?.setValue(base64);
    this.myForm.get('photo')?.markAsDirty();
    this.myForm.get('photo')?.markAsTouched();
  }

  onDelete(id: number): void {
    Swal.fire({
      icon: 'warning',
      title: 'Haberi Sil',
      text: 'Bu haberi ve detaylarını silmek istediğinizden emin misiniz?',
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#dc3545',
    }).then((res) => {
      if (res.isConfirmed) {
        this.newsService.deleteNews(id).subscribe(() => {
          this.detailService.deleteDetail(id).subscribe();
          this.getData();
        });
      }
    });
  }

  onDeleteAll(): void {
    if (!this.authService.isSuperAdmin()) return;
    Swal.fire({
      icon: 'warning',
      title: 'Tüm Haberleri Sil',
      text: 'Tüm haberler ve haber detayları kalıcı olarak silinecektir. Emin misiniz?',
      showCancelButton: true,
      confirmButtonText: 'Evet, Tümünü Sil',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#dc3545',
    }).then((res) => {
      if (res.isConfirmed) {
        this.newsService.deleteAllNews().subscribe(() => {
          this.getData();
        });
      }
    });
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
