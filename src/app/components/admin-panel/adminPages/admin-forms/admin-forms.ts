import { Component, inject, OnInit } from '@angular/core';
import { FormsService } from '../../../../services/forms-service';
import { formsModel } from '../../../../model/forms.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-admin-forms',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-forms.html',
  styleUrl: './admin-forms.css',
})
export class AdminForms implements OnInit {
  readonly FormsService = inject(FormsService);
  forms: formsModel[] = [];
  myForm: FormGroup;
  isNew = true;
  selectedItem?: formsModel;
  modalInstance: any;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      title: ['', Validators.required],
      link: ['', Validators.required],
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
    this.FormsService.getforms().subscribe(
      (resp) => {
        console.log('Gelen veri:', resp);

        if (resp.success && Array.isArray(resp.data)) {
          // En büyük ID’li haberi bul
          this.forms = [...resp.data].sort((a, b) => b.id - a.id);
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
    this.modalInstance.show();
  }
  onDelete(id: number): void {
    if (confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) {
      this.FormsService.deleteForms(id).subscribe(() => {
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
