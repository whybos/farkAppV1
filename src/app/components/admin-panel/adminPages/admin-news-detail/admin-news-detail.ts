import { Component, inject, OnInit } from '@angular/core';
import { newsDetailService } from '../../../../services/newsDetail-service';
import { newsDetailModel } from '../../../../model/newsDetail.model';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-admin-news-detail',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-news-detail.html',
  styleUrl: './admin-news-detail.css',
})
export class AdminNewsDetail implements OnInit {
  readonly detailService = inject(newsDetailService);
  detail: newsDetailModel = {};
  myForm: FormGroup;
  isNew = true;
  selectedItem?: newsDetailModel;
  modalInstance: any;
  id: number = 0;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.myForm = this.fb.group({
      newsId: [null],
      title: ['', Validators.required],
      summary: ['', Validators.required],
      body: ['', Validators.required],
      photo: ['', Validators.required],
      date: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.id = +id!;
      if (id) {
        this.getData(+id);
      }
    });

    const modalEl = document.getElementById('updateModal');
    if (modalEl) {
      // @ts-ignore
      this.modalInstance = new bootstrap.Modal(modalEl);
    }
  }

  getData(id: number) {
    this.detailService.getDetail(id).subscribe((resp) => {
      console.log(resp);
      this.detail = resp.data;
    });
  }
  onNew() {
    this.isNew = true;
    this.selectedItem = undefined;
    this.myForm.reset();
    this.modalInstance?.show();
  }
  onUpdate(item: newsDetailModel) {
    this.isNew = false;
    this.selectedItem = item;
    this.myForm.patchValue({
      newsId: item.newsId,
      photo: item.photo,
      title: item.title,
      summary: item.summary,
      body: item.body,
      date: item.date,
    });
    this.modalInstance.show();
  }

  onDelete(id: number): void {
    if (confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) {
      this.detailService.deleteDetail(id).subscribe(() => {
        this.getData(id);
      });
    }
  }
  saveUpdate(): void {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.myForm.patchValue({ newsId: this.id });
    const formData = this.myForm.value;

    if (this.isNew) {
      this.detailService.createDetail(formData).subscribe(() => {
        this.getData(this.id);
        this.modalInstance?.hide();
      });
    } else if (this.selectedItem) {
      this.detailService
        .updateDetail({ ...this.selectedItem, ...formData })
        .subscribe(() => {
          this.getData(this.id);
          this.modalInstance?.hide();
        });
    }
  }
}
