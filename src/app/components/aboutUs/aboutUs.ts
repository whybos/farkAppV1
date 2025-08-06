import { Component, inject, OnInit } from '@angular/core';
import { aboutUsService } from '../../services/aboutUs-service';
import { aboutUsModel } from '../../model/aboutUs.model';

@Component({
  selector: 'app-users',
  templateUrl: './aboutUs.html',
  styleUrls: ['./aboutUs.css'],
})
export class aboutUs implements OnInit {
  readonly aboutUsService = inject(aboutUsService);
  aboutUs: aboutUsModel[] = []; // Tek veri bile olsa dizi olarak tutuyorsan bu kalabilir

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.aboutUsService.getaboutUs().subscribe(
      (resp) => {
        console.log(resp);
        if (resp.success && Array.isArray(resp.data)) {
          // En büyük ID'ye sahip öğeyi bul
          const topItem = resp.data.reduce((prev, current) =>
            current.id > prev.id ? current : prev
          );

          // aboutUs'yu sadece bu öğe ile güncelle
          this.aboutUs = [topItem]; // tek öğe ama yine de dizi içinde
        }
      },
      (err) => {
        console.error('Veri çekme hatası:', err);
      }
    );
  }
}
