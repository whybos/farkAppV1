import { Component, inject, OnInit } from '@angular/core';
import { aboutUsService } from '../../../../services/aboutUs-service';
import { AuthService } from '../../../../services/auth-service';
import { aboutUsModel } from '../../../../model/aboutUs.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-about-us',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-about-us.html',
  styleUrl: './admin-about-us.css',
})
export class AdminAboutUs implements OnInit {
  readonly aboutUsService = inject(aboutUsService);
  readonly authService = inject(AuthService);
  aboutUs: aboutUsModel[] = [];
  myForm: FormGroup;
  isNew = true;
  selectedItem?: aboutUsModel;
  modalInstance: any;
  isSuperAdmin = false;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      body: ['', Validators.required],
      summary: ['', Validators.required],
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
    this.aboutUsService.getaboutUs().subscribe(
      (resp) => {
        if (resp.success && Array.isArray(resp.data)) {
          this.aboutUs = [...resp.data].sort((a, b) => b.id - a.id);
        } else {
          this.aboutUs = [];
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
  onUpdate(item: aboutUsModel) {
    this.isNew = false;
    this.selectedItem = item;
    this.myForm.patchValue({
      body: item.body,
      summary: item.summary,
      date: item.date,
    });
    this.modalInstance?.show();
  }

  onDelete(id: number): void {
    Swal.fire({
      icon: 'warning',
      title: 'Öğeyi Sil',
      text: 'Bu hakkımızda içeriğini silmek istediğinizden emin misiniz?',
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#dc3545',
    }).then((res) => {
      if (res.isConfirmed) {
        this.aboutUsService.deleteAboutUs(id).subscribe(() => {
          this.getData();
        });
      }
    });
  }

  onDeleteAll(): void {
    if (!this.authService.isSuperAdmin()) return;
    Swal.fire({
      icon: 'warning',
      title: 'Tüm Hakkımızda İçeriklerini Sil',
      text: 'Hakkımızda tablosundaki tüm kayıtlar kalıcı olarak silinecektir. Emin misiniz?',
      showCancelButton: true,
      confirmButtonText: 'Evet, Tümünü Sil',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#dc3545',
    }).then((res) => {
      if (res.isConfirmed) {
        this.aboutUsService.deleteAllAboutUs().subscribe(() => {
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
      this.aboutUsService.createAboutUs(formData).subscribe(() => {
        this.getData();
        this.modalInstance?.hide();
      });
    } else if (this.selectedItem) {
      this.aboutUsService
        .updateAboutUs({ ...this.selectedItem, ...formData })
        .subscribe(() => {
          this.getData();
          this.modalInstance?.hide();
        });
    }
  }
}
