import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SliderService } from '../../../../services/slider-service';
import { sliderModel } from '../../../../model/slider.model';

@Component({
  selector: 'app-admin-slider',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-slider.html',
  styleUrl: './admin-slider.css',
})
export class AdminSlider implements OnInit {
  readonly SliderService = inject(SliderService);
  slider: sliderModel[] = [];
  myForm: FormGroup;
  isNew = true;
  selectedItem?: sliderModel;
  modalInstance: any;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      photo: ['', Validators.required],
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
    this.SliderService.getSlider().subscribe(
      (resp) => {
        console.log('Gelen veri:', resp);

        if (resp.success && Array.isArray(resp.data)) {
          // En büyük ID’li haberi bul
          this.slider = [...resp.data].sort((a, b) => b.id - a.id);
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
    this.modalInstance.show();
  }

  onDelete(id: number): void {
    if (confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) {
      this.SliderService.deleteSlider(id).subscribe(() => {
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
