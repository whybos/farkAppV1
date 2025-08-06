import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { queryModel} from '../model/query.model';

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  private readonly apiUrl = '/assets/querylist.json';

  constructor(private http: HttpClient) {}

  getQueries(): Observable<queryModel[]> {
    return this.http.get<queryModel[]>(this.apiUrl);
  }
}
