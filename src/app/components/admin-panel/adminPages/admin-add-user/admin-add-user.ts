import { Component, inject } from '@angular/core';
import { usersModel } from '../../../../model/users.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../../services/user-service';

@Component({
  selector: 'app-admin-add-user',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-add-user.html',
  styleUrl: './admin-add-user.css',
})
export class AdminAddUser {
  readonly blogService = inject(UserService);
  users: usersModel[] = [];
  myForm: FormGroup;
  isNew = true;
  selectedItem?: usersModel;
  modalInstance: any;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
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

  getData() {
    this.blogService.getUser().subscribe(
      (resp) => {
        console.log('Gelen veri:', resp);

        if (resp.success && Array.isArray(resp.data)) {
          this.users = [...resp.data].sort((a, b) => b.id - a.id);
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
  onUpdate(item: usersModel) {
    this.isNew = false;
    this.selectedItem = item;
    this.myForm.patchValue({
      firstname: item.firstName,
      lastname: item.lastName,
      email: item.email,
      password: item.password,
    });
    this.modalInstance.show();
  }

  onDelete(id: number): void {
    if (confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) {
      this.blogService.deleteUser(id).subscribe(() => {
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
      this.blogService.createUser(formData).subscribe(() => {
        this.getData();
        this.modalInstance?.hide();
      });
    }
  }
}
