import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FarkindaService } from '../../../../services/farkinda-service';
import { AuthService } from '../../../../services/auth-service';
import { farkindaModel } from '../../../../model/farkinda.model';
import { ImageUpload } from '../../../global/image-upload/image-upload';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-farkinda',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImageUpload],
  templateUrl: './admin-farkinda.html',
  styleUrl: './admin-farkinda.css',
})
export class AdminFarkinda implements OnInit {
  readonly farkindaService = inject(FarkindaService);
  readonly authService = inject(AuthService);
  farkindaList: farkindaModel[] = [];
  myForm: FormGroup;
  isNew = true;
  selectedItem?: farkindaModel;
  modalInstance: any;
  isSuperAdmin = false;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      link: ['', Validators.required],
      photo: ['', Validators.required],
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

  getData(): void {
    this.farkindaService.getFarkinda().subscribe(
      (resp) => {
        if (resp.success && Array.isArray(resp.data)) {
          this.farkindaList = [...resp.data].sort((a, b) => b.id - a.id);
        } else {
          this.farkindaList = [];
        }
      },
      (err) => {
        console.error('Veri çekme hatası:', err);
      }
    );
  }

  onNew(): void {
    this.isNew = true;
    this.selectedItem = undefined;
    this.myForm.reset();
    this.modalInstance?.show();
  }

  onUpdate(item: farkindaModel): void {
    this.isNew = false;
    this.selectedItem = item;
    this.myForm.patchValue({
      title: item.title,
      date: item.date,
      link: item.link,
      photo: item.photo,
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
      title: 'Yayını Sil',
      text: "Bu FARK'ında yayınını silmek istediğinizden emin misiniz?",
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#dc3545',
    }).then((res) => {
      if (res.isConfirmed) {
        this.farkindaService.deleteFarkinda(id).subscribe(() => {
          this.getData();
        });
      }
    });
  }

  onDeleteAll(): void {
    if (!this.authService.isSuperAdmin()) return;
    Swal.fire({
      icon: 'warning',
      title: "Tüm FARK'ında Yayınlarını Sil",
      text: "FARK'ında tablosundaki tüm yayınlar kalıcı olarak silinecektir. Emin misiniz?",
      showCancelButton: true,
      confirmButtonText: 'Evet, Tümünü Sil',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#dc3545',
    }).then((res) => {
      if (res.isConfirmed) {
        this.farkindaService.deleteAllFarkinda().subscribe(() => {
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
      this.farkindaService.createFarkinda(formData).subscribe(() => {
        this.getData();
        this.modalInstance?.hide();
      });
    } else if (this.selectedItem) {
      this.farkindaService
        .updateFarkinda({ ...this.selectedItem, ...formData })
        .subscribe(() => {
          this.getData();
          this.modalInstance?.hide();
        });
    }
  }
}
