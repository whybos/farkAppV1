import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fark-dropzone-wrapper">
      <div
        class="fark-dropzone"
        [class.dragging]="isDragging()"
        [class.has-image]="!!value"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="fileInput.click()"
      >
        <input
          #fileInput
          type="file"
          accept="image/*"
          class="d-none"
          (change)="onFileSelected($event)"
        />

        @if (isProcessing()) {
          <div class="dropzone-status">
            <div class="spinner-border spinner-border-sm me-2" role="status"></div>
            <span>Görsel optimize ediliyor ve Base64'e çevriliyor...</span>
          </div>
        } @else if (value) {
          <div class="dropzone-preview-container" (click)="$event.stopPropagation()">
            <img [src]="value" alt="Yüklenen görsel önizleme" class="dropzone-preview-img" />
            <div class="dropzone-preview-info">
              @if (compressedInfo()) {
                <span class="dropzone-meta">{{ compressedInfo() }}</span>
              } @else {
                <span class="dropzone-meta">Görsel hazır (Base64)</span>
              }
              <div class="dropzone-actions">
                <button
                  type="button"
                  class="fark-btn-sm fark-btn-outline"
                  (click)="fileInput.click()"
                >
                  <i class="bi bi-arrow-repeat me-1"></i> Değiştir
                </button>
                <button
                  type="button"
                  class="fark-btn-sm fark-btn-danger"
                  (click)="clearImage()"
                >
                  <i class="bi bi-trash me-1"></i> Kaldır
                </button>
              </div>
            </div>
          </div>
        } @else {
          <div class="dropzone-empty">
            <i class="bi bi-cloud-arrow-up dropzone-icon"></i>
            <p class="dropzone-title">
              Fotoğrafı buraya sürükleyip bırakın veya seçmek için tıklayın
            </p>
            <span class="dropzone-subtitle">
              PNG, JPG, WEBP — Otomatik boyutlandırılır ve Base64'e çevrilir
            </span>
          </div>
        }
      </div>

      @if (errorMessage()) {
        <div class="text-danger small mt-1">
          <i class="bi bi-exclamation-circle me-1"></i>{{ errorMessage() }}
        </div>
      }
    </div>
  `,
})
export class ImageUpload {
  @Input() value: string | undefined | null = '';
  @Input() maxWidth = 1200;
  @Input() maxHeight = 1200;
  @Input() quality = 0.8;
  @Output() valueChange = new EventEmitter<string>();

  isDragging = signal(false);
  isProcessing = signal(false);
  compressedInfo = signal('');
  errorMessage = signal('');

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
      input.value = '';
    }
  }

  clearImage(): void {
    this.value = '';
    this.compressedInfo.set('');
    this.errorMessage.set('');
    this.valueChange.emit('');
  }

  private processFile(file: File): void {
    this.errorMessage.set('');
    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Lütfen geçerli bir görsel dosyası (JPG, PNG, WEBP) seçin.');
      return;
    }

    this.isProcessing.set(true);
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        this.isProcessing.set(false);
        this.errorMessage.set('Dosya okunamadı.');
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          if (width > this.maxWidth || height > this.maxHeight) {
            const ratio = Math.min(this.maxWidth / width, this.maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            this.finishWithBase64(dataUrl, width, height);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Try WebP first for best compression, fallback to JPEG
          let compressedBase64 = canvas.toDataURL('image/webp', this.quality);
          if (!compressedBase64.startsWith('data:image/webp')) {
            compressedBase64 = canvas.toDataURL('image/jpeg', this.quality);
          }

          this.finishWithBase64(compressedBase64, width, height);
        } catch {
          this.finishWithBase64(dataUrl, img.width, img.height);
        }
      };

      img.onerror = () => {
        this.isProcessing.set(false);
        this.errorMessage.set('Görsel işlenirken bir hata oluştu.');
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      this.isProcessing.set(false);
      this.errorMessage.set('Dosya okunurken bir hata oluştu.');
    };

    reader.readAsDataURL(file);
  }

  private finishWithBase64(base64: string, width: number, height: number): void {
    const approxBytes = Math.round((base64.length * 3) / 4);
    const kb = Math.max(1, Math.round(approxBytes / 1024));
    this.value = base64;
    this.compressedInfo.set(`${width}×${height}px · ~${kb} KB (Optimize Base64)`);
    this.isProcessing.set(false);
    this.valueChange.emit(base64);
  }
}
