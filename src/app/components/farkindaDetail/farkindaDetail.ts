import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PageFlip } from 'page-flip/dist/js/page-flip.module.js';
import { farkindaModel } from '../../model/farkinda.model';
import { FarkindaService } from '../../services/farkinda-service';

@Component({
  selector: 'app-farkinda-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './farkindaDetail.html',
  styleUrl: './farkindaDetail.css',
})
export class FarkindaDetail implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly farkindaService = inject(FarkindaService);

  @ViewChild('magazineIframe') magazineIframe?: ElementRef<HTMLIFrameElement>;
  @ViewChild('readerViewport') readerViewport?: ElementRef<HTMLDivElement>;
  @ViewChild('flipbookStageHost') flipbookStageHost?: ElementRef<HTMLDivElement>;

  allMagazines: farkindaModel[] = [];
  activeMagazine: farkindaModel | null = null;

  safeIframeUrl: SafeResourceUrl | null = null;
  rawCleanUrl = '';

  // farkindadergisi.com WebP / AVIF yapısı
  isFarkindaDergisiDomain = false;
  issueBaseUrl = 'https://farkindadergisi.com/2026-6';
  viewMode: 'page' | 'scroll' = 'page';

  currentPage = 1;
  totalPages = 76;
  pagesArray: number[] = Array.from({ length: 76 }, (_, i) => i + 1);

  // StPageFlip (Gerçekçi İkili Dergi ve Yumuşak Sayfa Kıvrımı)
  private pageFlip: PageFlip | null = null;
  private bookRootEl: HTMLElement | null = null;
  private initTimerId: ReturnType<typeof setTimeout> | null = null;
  isPortraitFlipMode = false;

  // Yakınlaştırma (Zoom) - %75 ile %200 arası gerçek ölçeklendirme
  zoomLevel = 100;
  readonly minZoom = 75;
  readonly maxZoom = 200;
  readonly zoomStep = 25;

  // Kaydırarak Oku modunda mouse ile sürükleyerek kaydırma (Pan)
  isDraggingViewport = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private dragScrollLeft = 0;
  private dragScrollTop = 0;

  isFullscreen = false;
  isLoading = true;
  webpLoadError = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const routeId = params.get('id');
      if (routeId) {
        this.loadFromRoute(+routeId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyPageFlip();
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.viewMode === 'page' && this.pageFlip) {
      this.updateFlipbookDimensions();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    const tag = (event.target as HTMLElement)?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    if (event.key === 'ArrowRight') {
      this.nextPage();
    } else if (event.key === 'ArrowLeft') {
      this.prevPage();
    } else if (event.key === '+' || event.key === '=') {
      this.zoomIn();
    } else if (event.key === '-') {
      this.zoomOut();
    } else if (event.key === 'Escape' && this.isFullscreen) {
      this.toggleFullscreen();
    }
  }

  private loadFromRoute(id: number): void {
    this.isLoading = true;
    this.farkindaService.getFarkinda().subscribe({
      next: (resp) => {
        if (resp?.success && Array.isArray(resp.data)) {
          this.allMagazines = [...resp.data].sort((a, b) => b.id - a.id);
          const found = this.allMagazines.find((m) => Number(m.id) === id);
          if (found) {
            this.setActiveMagazine(found);
            return;
          }
        }
        this.fetchSingleById(id);
      },
      error: () => {
        this.fetchSingleById(id);
      },
    });
  }

  private fetchSingleById(id: number): void {
    this.farkindaService.getFarkindaById(id).subscribe({
      next: (resp) => {
        if (resp?.data) {
          this.setActiveMagazine(resp.data);
        } else {
          this.isLoading = false;
        }
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  setActiveMagazine(item: farkindaModel): void {
    this.activeMagazine = item;
    this.currentPage = 1;
    this.zoomLevel = 100;
    this.webpLoadError = false;
    this.rawCleanUrl = this.normalizeEmbedUrl(item.link);
    this.detectMagazineFormat(this.rawCleanUrl);
    this.updateIframeUrl();

    if (this.viewMode === 'page' && this.isFarkindaDergisiDomain) {
      this.scheduleInitPageFlip(0);
    }
  }

  normalizeEmbedUrl(rawLink: string): string {
    if (!rawLink) return '';
    let trimmed = rawLink.trim();

    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      trimmed = srcMatch[1].trim();
    }

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      trimmed = `https://${trimmed}`;
    }

    const driveMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1] && trimmed.includes('drive.google.com')) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }

    return trimmed;
  }

  private detectMagazineFormat(url: string): void {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes('farkindadergisi.com')) {
        this.isFarkindaDergisiDomain = true;
        const segments = parsed.pathname
          .split('/')
          .filter((s) => s && s !== 'index.html' && !s.endsWith('.webp') && !s.endsWith('.avif'));
        const issueSlug = segments[0] || '2026-6';
        this.issueBaseUrl = `${parsed.origin}/${issueSlug}`;
        this.viewMode = 'page';
        return;
      }
    } catch {
      // Geçersiz URL ise varsayılan kaydırma moduna geç
    }
    this.isFarkindaDergisiDomain = false;
    this.viewMode = 'scroll';
  }

  getPageWebp900Url(page: number): string {
    const padded = String(page).padStart(3, '0');
    return `${this.issueBaseUrl}/p${padded}-900.webp`;
  }

  getPageWebp1800Url(page: number): string {
    const padded = String(page).padStart(3, '0');
    return `${this.issueBaseUrl}/p${padded}-1800.webp`;
  }

  getPageAvifSrcset(page: number): string {
    const padded = String(page).padStart(3, '0');
    return `${this.issueBaseUrl}/p${padded}-900.avif 900w, ${this.issueBaseUrl}/p${padded}-1800.avif 1800w`;
  }

  getPageWebpSrcset(page: number): string {
    const padded = String(page).padStart(3, '0');
    return `${this.issueBaseUrl}/p${padded}-900.webp 900w, ${this.issueBaseUrl}/p${padded}-1800.webp 1800w`;
  }

  /**
   * Kaydırarak Oku modunda sayfa kartının gerçek genişliğini hesaplar.
   */
  get zoomedCardWidth(): string {
    const scale = this.zoomLevel / 100;
    return `calc(min(88vw, 680px) * ${scale})`;
  }

  get zoomScaleRatio(): number {
    return this.zoomLevel / 100;
  }

  /**
   * İkili açık dergi görünümünde aktif sayfa aralığını gösterir (Örn: "2 - 3")
   */
  get activeSpreadText(): string {
    if (this.viewMode !== 'page' || !this.isFarkindaDergisiDomain || this.isPortraitFlipMode) {
      return `${this.currentPage}`;
    }
    if (this.currentPage <= 1) {
      return '1 (Kapak)';
    }
    if (this.currentPage >= this.totalPages && this.totalPages % 2 === 0) {
      return `${this.totalPages} (Arka Kapak)`;
    }
    const left = this.currentPage % 2 === 0 ? this.currentPage : this.currentPage - 1;
    const right = Math.min(this.totalPages, left + 1);
    return left === right ? `${left}` : `${left} - ${right}`;
  }

  private destroyPageFlip(): void {
    if (this.initTimerId) {
      clearTimeout(this.initTimerId);
      this.initTimerId = null;
    }
    if (this.pageFlip) {
      try {
        this.pageFlip.destroy();
      } catch {
        // Ignore cleanup errors
      }
      this.pageFlip = null;
    }
    this.bookRootEl = null;
    if (this.flipbookStageHost?.nativeElement) {
      this.flipbookStageHost.nativeElement.innerHTML = '';
    }
  }

  private computeFlipbookDimensions(): { singleW: number; pageH: number; bookW: number; isPortrait: boolean } {
    const viewport = this.readerViewport?.nativeElement;
    const vw = viewport?.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1100);
    const vh = viewport?.clientHeight || 640;

    const isPortrait = vw < 768;
    const pageRatio = 1800 / 2558; // ~0.703675
    const scale = this.zoomLevel / 100;

    if (!isPortrait) {
      const availW = Math.max(520, vw - 120);
      const availH = Math.max(440, vh - 32);

      let baseH = availH;
      let baseSingleW = Math.round(baseH * pageRatio);

      if (baseSingleW * 2 > availW) {
        baseSingleW = Math.floor(availW / 2);
        baseH = Math.round(baseSingleW / pageRatio);
      }

      const singleW = Math.round(baseSingleW * scale);
      const pageH = Math.round(baseH * scale);
      return { singleW, pageH, bookW: singleW * 2, isPortrait: false };
    } else {
      const availW = Math.max(260, vw - 16);
      const availH = Math.max(380, vh - 20);

      let baseSingleW = availW;
      let baseH = Math.round(baseSingleW / pageRatio);

      if (baseH > availH) {
        baseH = availH;
        baseSingleW = Math.round(baseH * pageRatio);
      }

      const singleW = Math.round(baseSingleW * scale);
      const pageH = Math.round(baseH * scale);
      return { singleW, pageH, bookW: singleW, isPortrait: true };
    }
  }

  private scheduleInitPageFlip(startPageIndex = 0): void {
    this.destroyPageFlip();
    this.isLoading = true;

    this.initTimerId = setTimeout(() => {
      this.initPageFlip(startPageIndex);
    }, 35);
  }

  private initPageFlip(startPageIndex = 0): void {
    const host = this.flipbookStageHost?.nativeElement;
    if (!host || !this.isFarkindaDergisiDomain || this.viewMode !== 'page') {
      this.isLoading = false;
      return;
    }

    host.innerHTML = '';
    const dims = this.computeFlipbookDimensions();
    this.isPortraitFlipMode = dims.isPortrait;

    const bookEl = document.createElement('div');
    bookEl.className = 'farkinda-flipbook-root';
    bookEl.style.width = `${dims.bookW}px`;
    bookEl.style.height = `${dims.pageH}px`;
    this.bookRootEl = bookEl;

    const pageElements: HTMLElement[] = [];
    const title = this.activeMagazine?.title || "FARK'ında Dergi";

    for (let pageNum = 1; pageNum <= this.totalPages; pageNum++) {
      const pageItem = document.createElement('div');
      pageItem.className = 'flip-page-item';
      pageItem.dataset['density'] = 'soft';

      const surface = document.createElement('div');
      surface.className = 'flip-page-surface';

      const skeleton = document.createElement('div');
      skeleton.className = 'flip-page-skeleton';
      skeleton.innerHTML = `<div class="spinner-border spinner-border-sm text-secondary" role="status"></div><span>Sayfa ${pageNum}</span>`;

      const img = document.createElement('img');
      img.className = 'flip-page-img';
      img.dataset['page'] = String(pageNum);
      img.alt = `${title} - Sayfa ${pageNum}`;
      img.decoding = 'async';
      img.draggable = false;

      if (pageNum === startPageIndex + 1 || pageNum === 1) {
        img.onload = () => {
          this.isLoading = false;
        };
        img.onerror = () => {
          if (pageNum === 1) {
            this.onWebpError();
          }
        };
      }

      const spineShade = document.createElement('div');
      spineShade.className = 'flip-page-spine-shade';

      surface.appendChild(skeleton);
      surface.appendChild(img);
      surface.appendChild(spineShade);
      pageItem.appendChild(surface);
      bookEl.appendChild(pageItem);
      pageElements.push(pageItem);
    }

    host.appendChild(bookEl);

    this.pageFlip = new PageFlip(bookEl, {
      width: dims.singleW,
      height: dims.pageH,
      size: 'stretch',
      minWidth: 200,
      maxWidth: 2400,
      minHeight: 280,
      maxHeight: 3400,
      maxShadowOpacity: 0.65,
      showCover: true,
      usePortrait: true,
      mobileScrollSupport: false,
      flippingTime: 900,
      drawShadow: true,
      showPageCorners: false,
      autoSize: false,
      startPage: startPageIndex,
    });

    this.pageFlip.loadFromHTML(pageElements);

    // Kapak dahil tüm sayfaların katı blok gibi değil, yumuşak dergi yaprağı gibi kıvrılmasını sağla
    const allPages = this.pageFlip.getPageCollection()?.getPages?.() || [];
    for (const p of allPages) {
      p.setDensity('soft');
      p.setDrawingDensity('soft');
    }

    this.pageFlip.on('flip', (e) => {
      const idx = Number(e.data) || 0;
      this.currentPage = idx + 1;
      this.ensureNearbyImagesLoaded(this.currentPage);
    });

    this.pageFlip.on('changeOrientation', (e) => {
      this.isPortraitFlipMode = e.data === 'portrait';
    });

    this.ensureNearbyImagesLoaded(startPageIndex + 1);

    setTimeout(() => {
      this.isLoading = false;
    }, 550);
  }

  /**
   * Aktif sayfa ve komşu sayfaların WebP görsellerini yükler; yakınlaştırma yüksekse 1800w kaliteye yükseltir.
   */
  private ensureNearbyImagesLoaded(centerPage: number): void {
    const host = this.flipbookStageHost?.nativeElement;
    if (!host) return;

    const useHighRes = this.zoomLevel >= 150;
    const minP = Math.max(1, centerPage - 4);
    const maxP = Math.min(this.totalPages, centerPage + 5);

    const imgs = host.querySelectorAll<HTMLImageElement>('img[data-page]');
    imgs.forEach((img) => {
      const pNum = Number(img.dataset['page']);
      if ((pNum >= minP && pNum <= maxP) || pNum <= 3 || pNum >= this.totalPages - 1) {
        const targetUrl = useHighRes ? this.getPageWebp1800Url(pNum) : this.getPageWebp900Url(pNum);
        if (!img.src) {
          img.src = targetUrl;
        } else if (useHighRes && img.src.endsWith('-900.webp') && Math.abs(pNum - centerPage) <= 2) {
          img.src = targetUrl;
        }
      }
    });
  }

  private updateFlipbookDimensions(): void {
    if (!this.pageFlip || !this.bookRootEl) return;
    const dims = this.computeFlipbookDimensions();
    this.isPortraitFlipMode = dims.isPortrait;
    this.bookRootEl.style.width = `${dims.bookW}px`;
    this.bookRootEl.style.height = `${dims.pageH}px`;

    setTimeout(() => {
      this.pageFlip?.update();
      this.ensureNearbyImagesLoaded(this.currentPage);
    }, 20);
  }

  setViewMode(mode: 'page' | 'scroll'): void {
    if (this.viewMode === mode) return;
    this.viewMode = mode;

    if (mode === 'scroll') {
      this.destroyPageFlip();
      if (this.isFarkindaDergisiDomain) {
        this.isLoading = false;
        setTimeout(() => this.scrollToPageCard(this.currentPage, 'auto'), 40);
      } else {
        this.updateIframeUrl();
      }
    } else {
      this.readerViewport?.nativeElement?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      this.scheduleInitPageFlip(Math.max(0, this.currentPage - 1));
    }
  }

  updateIframeUrl(): void {
    if (!this.rawCleanUrl) {
      this.safeIframeUrl = null;
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    const baseWithoutHash = this.rawCleanUrl.split('#')[0];

    let pagedUrl = baseWithoutHash;
    if (this.isFarkindaDergisiDomain) {
      pagedUrl = `${baseWithoutHash}#s${this.currentPage}`;
    } else {
      const separator = baseWithoutHash.includes('?') ? '&' : '?';
      pagedUrl =
        this.currentPage > 1
          ? `${baseWithoutHash}${separator}page=${this.currentPage}#page=${this.currentPage}`
          : baseWithoutHash;
    }

    this.safeIframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pagedUrl);
  }

  onMediaLoad(): void {
    this.isLoading = false;
  }

  onWebpError(): void {
    this.isLoading = false;
    this.webpLoadError = true;
    this.destroyPageFlip();
    this.viewMode = 'scroll';
    this.updateIframeUrl();
  }

  prevPage(): void {
    if (this.viewMode === 'page' && this.pageFlip) {
      if (this.currentPage > 1) {
        this.ensureNearbyImagesLoaded(Math.max(1, this.currentPage - 2));
        this.pageFlip.flipPrev('top');
      }
      return;
    }

    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyScrollOrIframePageChange();
    }
  }

  nextPage(): void {
    if (this.viewMode === 'page' && this.pageFlip) {
      if (this.currentPage < this.totalPages) {
        this.ensureNearbyImagesLoaded(Math.min(this.totalPages, this.currentPage + 2));
        this.pageFlip.flipNext('top');
      }
      return;
    }

    if (this.isFarkindaDergisiDomain && this.currentPage >= this.totalPages) {
      return;
    }
    this.currentPage++;
    this.applyScrollOrIframePageChange();
  }

  firstPage(): void {
    if (this.currentPage === 1) return;
    if (this.viewMode === 'page' && this.pageFlip) {
      this.ensureNearbyImagesLoaded(1);
      this.pageFlip.flip(0, 'top');
      return;
    }
    this.currentPage = 1;
    this.applyScrollOrIframePageChange();
  }

  lastPage(): void {
    if (!this.isFarkindaDergisiDomain || this.currentPage === this.totalPages) return;
    if (this.viewMode === 'page' && this.pageFlip) {
      this.ensureNearbyImagesLoaded(this.totalPages);
      this.pageFlip.flip(this.totalPages - 1, 'top');
      return;
    }
    this.currentPage = this.totalPages;
    this.applyScrollOrIframePageChange();
  }

  goToPage(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = parseInt(input.value, 10);
    if (!isNaN(val) && val >= 1) {
      if (this.isFarkindaDergisiDomain && val > this.totalPages) {
        val = this.totalPages;
      }
      if (val !== this.currentPage) {
        if (this.viewMode === 'page' && this.pageFlip) {
          this.ensureNearbyImagesLoaded(val);
          this.pageFlip.flip(val - 1, 'top');
        } else {
          this.currentPage = val;
          this.applyScrollOrIframePageChange();
        }
      }
    } else {
      input.value = String(this.currentPage);
    }
  }

  private applyScrollOrIframePageChange(): void {
    if (this.viewMode === 'scroll' && this.isFarkindaDergisiDomain) {
      this.scrollToPageCard(this.currentPage, 'smooth');
    } else {
      this.updateIframeUrl();
    }
  }

  private scrollToPageCard(page: number, behavior: ScrollBehavior = 'smooth'): void {
    const viewport = this.readerViewport?.nativeElement;
    if (!viewport) return;
    const targetEl = viewport.querySelector(`#scroll-page-${page}`) as HTMLElement | null;
    if (targetEl) {
      targetEl.scrollIntoView({ behavior, block: 'start' });
    }
  }

  onViewportScroll(): void {
    if (this.viewMode !== 'scroll' || !this.isFarkindaDergisiDomain) return;
    const viewport = this.readerViewport?.nativeElement;
    if (!viewport) return;

    const cards = viewport.querySelectorAll<HTMLElement>('.scroll-page-item');
    if (!cards.length) return;

    const viewportCenter = viewport.scrollTop + viewport.clientHeight * 0.35;
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const top = card.offsetTop;
      const bottom = top + card.offsetHeight;
      if (viewportCenter >= top && viewportCenter <= bottom) {
        this.currentPage = i + 1;
        break;
      }
    }
  }

  zoomIn(): void {
    if (this.zoomLevel < this.maxZoom) {
      this.zoomLevel = Math.min(this.maxZoom, this.zoomLevel + this.zoomStep);
      this.updateFlipbookDimensions();
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > this.minZoom) {
      this.zoomLevel = Math.max(this.minZoom, this.zoomLevel - this.zoomStep);
      this.updateFlipbookDimensions();
    }
  }

  resetZoom(): void {
    this.zoomLevel = 100;
    this.updateFlipbookDimensions();
  }

  toggleQuickZoom(): void {
    this.zoomLevel = this.zoomLevel > 100 ? 100 : 150;
    this.updateFlipbookDimensions();
  }

  onViewportMouseDown(event: MouseEvent): void {
    if (this.viewMode !== 'scroll' || this.zoomLevel <= 100) return;
    const viewport = this.readerViewport?.nativeElement;
    if (!viewport) return;

    this.isDraggingViewport = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.dragScrollLeft = viewport.scrollLeft;
    this.dragScrollTop = viewport.scrollTop;
  }

  @HostListener('window:mousemove', ['$event'])
  onViewportMouseMove(event: MouseEvent): void {
    if (!this.isDraggingViewport) return;
    const viewport = this.readerViewport?.nativeElement;
    if (!viewport) return;

    const dx = event.clientX - this.dragStartX;
    const dy = event.clientY - this.dragStartY;
    viewport.scrollLeft = this.dragScrollLeft - dx;
    viewport.scrollTop = this.dragScrollTop - dy;
  }

  @HostListener('window:mouseup')
  onViewportMouseUp(): void {
    this.isDraggingViewport = false;
  }

  toggleFullscreen(): void {
    this.isFullscreen = !this.isFullscreen;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = this.isFullscreen ? 'hidden' : '';
    }
    setTimeout(() => {
      this.updateFlipbookDimensions();
    }, 50);
  }

  switchMagazine(item: farkindaModel): void {
    this.router.navigate(['/farkinda/detail', item.id]);
  }

  get currentMagazineIndex(): number {
    if (!this.activeMagazine || !this.allMagazines.length) return -1;
    return this.allMagazines.findIndex(
      (m) => Number(m.id) === Number(this.activeMagazine?.id)
    );
  }

  get hasPrevMagazine(): boolean {
    return this.currentMagazineIndex > 0;
  }

  get hasNextMagazine(): boolean {
    const idx = this.currentMagazineIndex;
    return idx >= 0 && idx < this.allMagazines.length - 1;
  }

  goPrevMagazine(): void {
    const idx = this.currentMagazineIndex;
    if (idx > 0) {
      this.switchMagazine(this.allMagazines[idx - 1]);
    }
  }

  goNextMagazine(): void {
    const idx = this.currentMagazineIndex;
    if (idx >= 0 && idx < this.allMagazines.length - 1) {
      this.switchMagazine(this.allMagazines[idx + 1]);
    }
  }
}
