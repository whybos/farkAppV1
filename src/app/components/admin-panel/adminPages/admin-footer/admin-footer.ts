import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FooterService } from '../../../../services/footer-service';
import { footerModel } from '../../../../model/footer.model';

@Component({
  selector: 'app-admin-footer',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-footer.html',
  styleUrl: './admin-footer.css',
})
export class AdminFooter implements OnInit {
  readonly footerService = inject(FooterService);
  footer: footerModel[] = [];
  myForm: FormGroup;
  isNew = true;
  selectedItem?: footerModel;
  modalInstance: any;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      body: ['', Validators.required],
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
    this.footerService.getfooter().subscribe(
      (resp) => {
        console.log('Gelen veri:', resp);

        if (resp.success && Array.isArray(resp.data)) {
          // En büyük ID’li haberi bul
          this.footer = [...resp.data].sort((a, b) => b.id - a.id);
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
    this.modalInstance.show();
  }
  onDelete(id: number): void {
    if (confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) {
      this.footerService.deleteFooter(id).subscribe(() => {
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
