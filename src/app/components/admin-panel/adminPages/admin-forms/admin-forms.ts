import { Component, inject, OnInit } from '@angular/core';
import { FormsService } from '../../../../services/forms-service';
import { AuthService } from '../../../../services/auth-service';
import { formsModel } from '../../../../model/forms.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-forms',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-forms.html',
  styleUrl: './admin-forms.css',
})
export class AdminForms implements OnInit {
  readonly FormsService = inject(FormsService);
  readonly authService = inject(AuthService);
  forms: formsModel[] = [];
  myForm: FormGroup;
  isNew = true;
  selectedItem?: formsModel;
  modalInstance: any;
  isSuperAdmin = false;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      title: ['', Validators.required],
      link: ['', Validators.required],
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
    this.FormsService.getforms().subscribe(
      (resp) => {
        if (resp.success && Array.isArray(resp.data)) {
          this.forms = [...resp.data].sort((a, b) => b.id - a.id);
        } else {
          this.forms = [];
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
  onUpdate(item: formsModel) {
    this.isNew = false;
    this.selectedItem = item;
    this.myForm.patchValue({
      title: item.title,
      link: item.link,
    });
    this.modalInstance?.show();
  }
  onDelete(id: number): void {
    Swal.fire({
      icon: 'warning',
      title: 'Formu Sil',
      text: 'Bu formu silmek istediğinizden emin misiniz?',
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#dc3545',
    }).then((res) => {
      if (res.isConfirmed) {
        this.FormsService.deleteForms(id).subscribe(() => {
          this.getData();
        });
      }
    });
  }

  onDeleteAll(): void {
    if (!this.authService.isSuperAdmin()) return;
    Swal.fire({
      icon: 'warning',
      title: 'Tüm Formları Sil',
      text: 'Formlar tablosundaki tüm kayıtlar kalıcı olarak silinecektir. Emin misiniz?',
      showCancelButton: true,
      confirmButtonText: 'Evet, Tümünü Sil',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#dc3545',
    }).then((res) => {
      if (res.isConfirmed) {
        this.FormsService.deleteAllForms().subscribe(() => {
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
      this.FormsService.createForms(formData).subscribe(() => {
        this.getData();
        this.modalInstance?.hide();
      });
    } else if (this.selectedItem) {
      this.FormsService.updateForms({
        ...this.selectedItem,
        ...formData,
      }).subscribe(() => {
        this.getData();
        this.modalInstance?.hide();
      });
    }
  }
}
