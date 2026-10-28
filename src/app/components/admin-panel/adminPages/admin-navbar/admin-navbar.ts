import { Component, inject, OnInit } from '@angular/core';
import { NavbarService } from '../../../../services/navbar-service';
import { AuthService } from '../../../../services/auth-service';
import { navbarModel } from '../../../../model/navbar.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-navbar',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-navbar.html',
  styleUrl: './admin-navbar.css',
})
export class AdminNavbar implements OnInit {
  readonly navbarService = inject(NavbarService);
  readonly authService = inject(AuthService);
  navbar: navbarModel[] = [];
  myForm: FormGroup;
  isNew = true;
  selectedItem?: navbarModel;
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
    this.navbarService.getnavbar().subscribe(
      (resp) => {
        if (resp.success && Array.isArray(resp.data)) {
          this.navbar = [...resp.data].sort((a, b) => b.id - a.id);
        } else {
          this.navbar = [];
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
  onUpdate(item: navbarModel) {
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
      text: 'Bu menü öğesini silmek istediğinizden emin misiniz?',
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#dc3545',
    }).then((res) => {
      if (res.isConfirmed) {
        this.navbarService.deleteNavbar(id).subscribe(() => {
          this.getData();
        });
      }
    });
  }

  onDeleteAll(): void {
    if (!this.authService.isSuperAdmin()) return;
    Swal.fire({
      icon: 'warning',
      title: 'Tüm Navbar Öğelerini Sil',
      text: 'Navbar tablosundaki tüm menü öğeleri kalıcı olarak silinecektir. Emin misiniz?',
      showCancelButton: true,
      confirmButtonText: 'Evet, Tümünü Sil',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#dc3545',
    }).then((res) => {
      if (res.isConfirmed) {
        this.navbarService.deleteAllNavbar().subscribe(() => {
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
      this.navbarService.createNavbar(formData).subscribe(() => {
        this.getData();
        this.modalInstance?.hide();
      });
    } else if (this.selectedItem) {
      this.navbarService
        .updateNavbar({ ...this.selectedItem, ...formData })
        .subscribe(() => {
          this.getData();
          this.modalInstance?.hide();
        });
    }
  }
}
