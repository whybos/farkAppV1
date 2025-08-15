import { Component, inject, OnInit } from '@angular/core';
import { FormsService } from '../../services/forms-service';
import { formsModel } from '../../model/forms.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnInit {
  readonly formsService = inject(FormsService);
  readonly sanitizer = inject(DomSanitizer);
  forms: formsModel[] = [];
  title: string = 'Etkinlik Formlarımız';

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.formsService.getforms().subscribe(
      (resp) => {
        console.log('Gelen veri:', resp);
        if (resp.success && Array.isArray(resp.data)) {
          this.forms = resp.data;

          this.forms.forEach((element) => {
            element.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              element.link
            );
          });
        }
      },
      (err) => {
        console.error('Veri çekme hatası:', err);
      }
    );
  }
}
