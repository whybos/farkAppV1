import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { queryModel } from '../../model/query.model';
import { QueryService } from '../../services/query-service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-query-checker',
  templateUrl: './query.html',
  styleUrls: ['./query.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class Query {
  inputValue: string = '';
  queries: queryModel[] = [];

  constructor(private queryService: QueryService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.queryService.getQueries().subscribe((resp) => {
      this.queries = resp;
    });
  }

  checkQuery() {
    const input = this.inputValue.trim().toLowerCase();

    // Giriş boşsa uyar
    if (!input) {
      Swal.fire({
        icon: 'info',
        title: 'Girdi boş',
        text: 'Lütfen bir ürün adı girin.',
        confirmButtonColor: '#0d6efd',
        color: '#f5f5f5',
        background: '#171616ff',
      });
      return;
    }

    // Liste kontrolü
    const found = this.queries.some(
      (item) => item.keyword.toLowerCase() === input
    );

    if (found) {
      Swal.fire({
        icon: 'warning',
        title: 'Dikkat!',
        text: 'Bu ürün boykot listemizde bulunmaktadır. Alınmamasını tavsiye ederiz ❌',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Anladım',
        color: '#f5f5f5',
        background: '#171616ff',
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Temiz!',
        text: 'Bu ürün boykot listemizde bulunmamaktadır ✅',
        color: '#f5f5f5',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Tamam',
        background: '#171616ff',
      });
    }
  }
}
