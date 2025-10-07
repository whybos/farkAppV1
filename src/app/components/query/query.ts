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
  suggestions: string[] = [];
  hovered: string = '';
  buttonvis: boolean = true;

  constructor(private queryService: QueryService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.queryService.getQueries().subscribe((resp) => {
      this.queries = resp;
    });
  }

  onInputChange() {
    const input = this.inputValue.trim().toLowerCase();

    // 3 harften azsa öneri gösterme
    if (input.length < 3) {
      this.suggestions = [];
      return;
    }

    // Önerileri filtrele
    this.suggestions = this.queries
      .map((q) => q.keyword)
      .filter((keyword) => keyword.toLowerCase().includes(input));
  }

  selectSuggestion(suggestion: string) {
    this.inputValue = suggestion;
    this.suggestions = [];
  }

  checkQuery() {
    const input = this.inputValue.trim().toLowerCase();

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
