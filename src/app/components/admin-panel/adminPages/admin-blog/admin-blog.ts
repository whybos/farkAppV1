import { Component, inject, OnInit } from '@angular/core';
import { BlogModel } from '../../../../model/blog.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BlogService } from '../../../../services/blog-service';
import { AuthService } from '../../../../services/auth-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-blog',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-blog.html',
  styleUrl: './admin-blog.css',
})
export class AdminBlog implements OnInit {
  readonly blogService = inject(BlogService);
  readonly authService = inject(AuthService);
  blogs: BlogModel[] = [];
  myForm: FormGroup;
  isNew = true;
  selectedItem?: BlogModel;
  modalInstance: any;
  isSuperAdmin = false;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      speaker: ['', Validators.required],
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
    this.blogService.getBlog().subscribe(
      (resp) => {
        if (resp.success && Array.isArray(resp.data)) {
          this.blogs = [...resp.data].sort((a, b) => b.id - a.id);
        } else {
          this.blogs = [];
        }
      },
      (err) => {
        console.error('Veri çekme hatası:', err);
      }
    );
  }
  onNew() {
    this.isNew = true;
    this.selectedItem = undefined;
    this.myForm.reset();
    this.modalInstance?.show();
  }
  onUpdate(item: BlogModel) {
    this.isNew = false;
    this.selectedItem = item;
    this.myForm.patchValue({
      title: item.title,
      body: item.body,
      speaker: item.speaker,
      date: item.date,
    });
    this.modalInstance?.show();
  }

  onDelete(id: number): void {
    Swal.fire({
      icon: 'warning',
      title: 'Bilgiyi Sil',
      text: 'Bu haftalık bilgi paylaşımını silmek istediğinizden emin misiniz?',
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#dc3545',
    }).then((res) => {
      if (res.isConfirmed) {
        this.blogService.deleteBlog(id).subscribe(() => {
          this.getData();
        });
      }
    });
  }

  onDeleteAll(): void {
    if (!this.authService.isSuperAdmin()) return;
    Swal.fire({
      icon: 'warning',
      title: 'Tüm Haftalık Bilgileri Sil',
      text: 'Haftalık Bilgi (Blog) tablosundaki tüm kayıtlar kalıcı olarak silinecektir. Emin misiniz?',
      showCancelButton: true,
      confirmButtonText: 'Evet, Tümünü Sil',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#dc3545',
    }).then((res) => {
      if (res.isConfirmed) {
        this.blogService.deleteAllBlogs().subscribe(() => {
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
      this.blogService.createBlog(formData).subscribe(() => {
        this.getData();
        this.modalInstance?.hide();
      });
    } else if (this.selectedItem) {
      this.blogService
        .updateBlog({ ...this.selectedItem, ...formData })
        .subscribe(() => {
          this.getData();
          this.modalInstance?.hide();
        });
    }
  }
}
