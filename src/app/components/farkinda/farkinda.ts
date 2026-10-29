import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FarkindaService } from '../../services/farkinda-service';
import { farkindaModel } from '../../model/farkinda.model';

@Component({
  selector: 'app-farkinda',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './farkinda.html',
  styleUrl: './farkinda.css',
})
export class Farkinda implements OnInit {
  readonly farkindaService = inject(FarkindaService);
  farkindaList: farkindaModel[] = [];

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.farkindaService.getFarkinda().subscribe(
      (resp) => {
        if (resp.success && Array.isArray(resp.data)) {
          this.farkindaList = [...resp.data].sort((a, b) => b.id - a.id);
        } else {
          this.farkindaList = [];
        }
      },
      (err) => {
        console.error('FARKında veri çekme hatası:', err);
      }
    );
  }
}
