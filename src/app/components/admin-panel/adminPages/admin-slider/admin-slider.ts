import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SliderService } from '../../../../services/slider-service';
import { AuthService } from '../../../../services/auth-service';
import { sliderModel } from '../../../../model/slider.model';
import { ImageUpload } from '../../../global/image-upload/image-upload';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-slider',
  standalone: true,
  imports: [ReactiveFormsModule, ImageUpload],
  templateUrl: './admin-slider.html',
  styleUrl: './admin-slider.css',
})
export class AdminSlider implements OnInit {
  readonly SliderService = inject(SliderService);
  readonly authService = inject(AuthService);
  slider: sliderModel[] = [];
  myForm: FormGroup;
  isNew = true;
  selectedItem?: sliderModel;
  modalInstance: any;
  isSuperAdmin = false;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
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

  getData() {
    this.SliderService.getSlider().subscribe(
      (resp) => {
        if (resp.success && Array.isArray(resp.data)) {
          this.slider = [...resp.data].sort((a, b) => b.id - a.id);
        } else {
          this.slider = [];
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
  onUpdate(item: sliderModel) {
    this.isNew = false;
    this.selectedItem = item;
    this.myForm.patchValue({
      body: item.body,
      title: item.title,
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
      title: 'Öğeyi Sil',
      text: 'Bu slider öğesini silmek istediğinizden emin misiniz?',
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#dc3545',
    }).then((res) => {
      if (res.isConfirmed) {
        this.SliderService.deleteSlider(id).subscribe(() => {
          this.getData();
        });
      }
    });
  }

  onDeleteAll(): void {
    if (!this.authService.isSuperAdmin()) return;
    Swal.fire({
      icon: 'warning',
      title: 'Tüm Slider Öğelerini Sil',
      text: 'Slider tablosundaki tüm kayıtlar kalıcı olarak silinecektir. Emin misiniz?',
      showCancelButton: true,
      confirmButtonText: 'Evet, Tümünü Sil',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#dc3545',
    }).then((res) => {
      if (res.isConfirmed) {
        this.SliderService.deleteAllSlider().subscribe(() => {
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
      this.SliderService.createSlider(formData).subscribe(() => {
        this.getData();
        this.modalInstance?.hide();
      });
    } else if (this.selectedItem) {
      this.SliderService.updateSlider({
        ...this.selectedItem,
        ...formData,
      }).subscribe(() => {
        this.getData();
        this.modalInstance?.hide();
      });
    }
  }
}
