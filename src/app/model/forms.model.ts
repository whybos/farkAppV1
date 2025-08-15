import { SafeResourceUrl } from '@angular/platform-browser';

export interface formsModel {
  id: number;
  title: string;
  link: string;
  safeUrl: SafeResourceUrl;
}
