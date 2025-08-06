import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterService } from '../../../services/footer-service';
import { footerModel } from '../../../model/footer.model';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  readonly footerService = inject(FooterService);
  footer: footerModel[] = [];

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.footerService.getfooter().subscribe(
      (resp) => {
        console.log(resp);
        if (resp.success && Array.isArray(resp.data)) {
          this.footer = resp.data;
        }
      },
      (err) => {
        console.error('Veri çekme hatası:', err);
      }
    );
  }
}
