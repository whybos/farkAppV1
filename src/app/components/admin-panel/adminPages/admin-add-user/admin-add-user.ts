import { Component, inject, OnInit } from '@angular/core';
import { usersModel } from '../../../../model/users.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../../services/user-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-add-user',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-add-user.html',
  styleUrl: './admin-add-user.css',
})
export class AdminAddUser implements OnInit {
  readonly userService = inject(UserService);
  users: usersModel[] = [];
  myForm: FormGroup;
  isNew = true;
  selectedItem?: usersModel;
  modalInstance: any;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
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

  getData(): void {
    this.userService.getUser().subscribe({
      next: (resp) => {
        if (resp && Array.isArray(resp.data)) {
          this.users = [...resp.data].sort((a, b) => b.id - a.id);
        } else {
          this.users = [];
        }
      },
      error: (err) => {
        console.error('Veri çekme hatası:', err);
      },
    });
  }

  onNew(): void {
    this.isNew = true;
    this.selectedItem = undefined;
    this.myForm.reset();
    this.modalInstance?.show();
  }

  onUpdate(item: usersModel): void {
    this.isNew = false;
    this.selectedItem = item;
    this.myForm.patchValue({
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      password: item.password,
    });
    this.modalInstance?.show();
  }

  onDelete(id: number): void {
    if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.getData();
        },
        error: (err) => {
          console.error('Kullanıcı silme hatası:', err);
          Swal.fire({
            icon: 'error',
            title: 'Silinemedi',
            text: typeof err?.error === 'string' ? err.error : 'Kullanıcı silinirken bir hata oluştu.',
            confirmButtonColor: '#dc2626',
            color: '#f5f5f5',
            background: '#141414',
          });
        },
      });
    }
  }

  saveUpdate(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    const raw = this.myForm.value;
    const payload = {
      firstName: (raw.firstName || '').trim(),
      lastName: (raw.lastName || '').trim(),
      email: (raw.email || '').trim(),
      password: raw.password || '',
    };

    if (this.isNew) {
      this.userService.createUser(payload).subscribe({
        next: () => {
          this.getData();
          this.modalInstance?.hide();
          Swal.fire({
            icon: 'success',
            title: 'Başarılı',
            text: 'Yeni kullanıcı başarıyla eklendi.',
            confirmButtonColor: '#2563eb',
            color: '#f5f5f5',
            background: '#141414',
          });
        },
        error: (err) => {
          console.error('Kullanıcı ekleme hatası:', err);
          const backendMsg =
            typeof err?.error === 'string' && err.error.length < 300
              ? err.error
              : 'Sunucu veritabanına kayıt eklerken hata döndürdü (500 DbUpdateException).';
          Swal.fire({
            icon: 'error',
            title: 'Kullanıcı Eklenemedi',
            text: backendMsg,
            confirmButtonColor: '#dc2626',
            color: '#f5f5f5',
            background: '#141414',
          });
        },
      });
    }
  }
}
