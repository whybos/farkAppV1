import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { queryModel } from '../../model/query.model';
import { QueryService } from '../../services/query-service';

@Component({
  selector: 'app-query-checker',
  templateUrl: './query.html',
  styleUrls: ['./query.css'],
  standalone: true,
  imports: [FormsModule]  // FormsModule burada import edildi
})
export class Query {
  inputValue: string = '';
  queries: queryModel[] = [];
  result: string = '';

  constructor(private queryService: QueryService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.queryService.getQueries().subscribe(
      resp => {
        this.queries = resp;
      }
    );
  }

  checkQuery() {
    const input = this.inputValue.trim().toLowerCase();
    let found = false;

    for (let item of this.queries) {
      if (item.keyword.toLowerCase() === input) {
        found = true;
        break;
      }
    }

    this.result = found ? 'Bulundu ✅' : 'Bulunamadı ❌';
  }
}
