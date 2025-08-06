import { Injectable } from '@angular/core';
import { newsDetailModel } from '../model/newsDetail.model';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SingleResponse } from '../model/globalResponseModel';

@Injectable({
  providedIn: 'root',
})
export class newsDetailService {
  private apiUrl = `https://localhost:44345/api/NewsDetail/GetById?id=`;

  constructor(private httpClient: HttpClient) {}

  getDetail(id: number): Observable<SingleResponse<newsDetailModel>> {
    return this.httpClient.get<SingleResponse<newsDetailModel>>(
      this.apiUrl + id
    );
  }
}
