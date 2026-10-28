import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FooterService } from '../../../../services/footer-service';
import { AuthService } from '../../../../services/auth-service';
import { footerModel } from '../../../../model/footer.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-footer',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-footer.html',
  styleUrl: './admin-footer.css',
})
export class AdminFooter implements OnInit {
  readonly footerService = inject(FooterService);
  readonly authService = inject(AuthService);
  footer: footerModel[] = [];
  myForm: FormGroup;
  isNew = true;
  selectedItem?: footerModel;
  modalInstance: any;
  isSuperAdmin = false;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      body: ['', Validators.required],
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
    this.footerService.getfooter().subscribe(
      (resp) => {
        if (resp.success && Array.isArray(resp.data)) {
          this.footer = [...resp.data].sort((a, b) => b.id - a.id);
        } else {
          this.footer = [];
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
  onUpdate(item: footerModel) {
    this.isNew = false;
    this.selectedItem = item;
    this.myForm.patchValue({
      body: item.body,
      link: item.link,
    });
    this.modalInstance?.show();
  }
  onDelete(id: number): void {
    Swal.fire({
      icon: 'warning',
      title: 'Öğeyi Sil',
      text: 'Bu footer bağlantısını silmek istediğinizden emin misiniz?',
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#dc3545',
    }).then((res) => {
      if (res.isConfirmed) {
        this.footerService.deleteFooter(id).subscribe(() => {
          this.getData();
        });
      }
    });
  }

  onDeleteAll(): void {
    if (!this.authService.isSuperAdmin()) return;
    Swal.fire({
      icon: 'warning',
      title: 'Tüm Footer Linklerini Sil',
      text: 'Footer tablosundaki tüm bağlantılar kalıcı olarak silinecektir. Emin misiniz?',
      showCancelButton: true,
      confirmButtonText: 'Evet, Tümünü Sil',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#dc3545',
    }).then((res) => {
      if (res.isConfirmed) {
        this.footerService.deleteAllFooter().subscribe(() => {
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
      this.footerService.createFooter(formData).subscribe(() => {
        this.getData();
        this.modalInstance?.hide();
      });
    } else if (this.selectedItem) {
      this.footerService
        .updateFooter({ ...this.selectedItem, ...formData })
        .subscribe(() => {
          this.getData();
          this.modalInstance?.hide();
        });
    }
  }
}
