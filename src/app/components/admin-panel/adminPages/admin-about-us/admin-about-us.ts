import { Component, inject, OnInit } from '@angular/core';
import { aboutUsService } from '../../../../services/aboutUs-service';
import { aboutUsModel } from '../../../../model/aboutUs.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-admin-about-us',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-about-us.html',
  styleUrl: './admin-about-us.css',
})
export class AdminAboutUs implements OnInit {
  readonly aboutUsService = inject(aboutUsService);
  aboutUs: aboutUsModel[] = [];
  myForm: FormGroup;
  isNew = true;
  selectedItem?: aboutUsModel;
  modalInstance: any;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      body: ['', Validators.required],
      summary: ['', Validators.required],
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
    this.aboutUsService.getaboutUs().subscribe(
      (resp) => {
        console.log('Gelen veri:', resp);

        if (resp.success && Array.isArray(resp.data)) {
          // En büyük ID’li haberi bul
          this.aboutUs = [...resp.data].sort((a, b) => b.id - a.id);
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
    this.modalInstance.show();
  }

  onDelete(id: number): void {
    if (confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) {
      this.aboutUsService.deleteAboutUs(id).subscribe(() => {
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
