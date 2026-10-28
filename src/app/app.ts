import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/global/navbar/navbar';
import { Footer } from './components/global/footer/footer';
import { ThemeService } from './services/theme-service';

@Component({
  selector: 'app-root',
  imports: [Navbar, Footer, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('FARK-APP');
  readonly themeService = inject(ThemeService);

  showScrollTopButton = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const yOffset =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.showScrollTopButton = yOffset > 300;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
