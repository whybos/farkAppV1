import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'fark-theme';
  readonly theme = signal<ThemeMode>('dark');

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.STORAGE_KEY) as ThemeMode | null;
      const initial: ThemeMode = saved === 'light' || saved === 'dark' ? saved : 'dark';
      this.setTheme(initial);
    }
  }

  setTheme(mode: ThemeMode): void {
    this.theme.set(mode);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', mode);
      document.body.setAttribute('data-theme', mode);
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, mode);
    }
  }

  toggleTheme(): void {
    const next: ThemeMode = this.theme() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  isDark(): boolean {
    return this.theme() === 'dark';
  }
}
