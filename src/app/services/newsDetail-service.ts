import { Injectable } from '@angular/core';
import { newsDetailModel } from '../model/newsDetail.model';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SingleResponse } from '../model/globalResponseModel';

@Injectable({
  providedIn: 'root',
})
export class newsDetailService {
  private apiUrl = `https://localhost:44345/api/NewsDetail`;

  constructor(private httpClient: HttpClient) {}

  getDetail(id: number): Observable<SingleResponse<newsDetailModel>> {
    return this.httpClient.get<SingleResponse<newsDetailModel>>(
      'https://localhost:44345/api/NewsDetail/GetById?id=' + id
    );
  }
  createDetail(
    data: newsDetailModel
  ): Observable<SingleResponse<newsDetailModel>> {
    return this.httpClient.post<SingleResponse<newsDetailModel>>(
      this.apiUrl,
      data
    );
  }

  updateDetail(
    data: newsDetailModel
  ): Observable<SingleResponse<newsDetailModel>> {
    return this.httpClient.patch<SingleResponse<newsDetailModel>>(
      this.apiUrl,
      data
    );
  }

  deleteDetail(id: number): Observable<SingleResponse<newsDetailModel>> {
    return this.httpClient.delete<SingleResponse<newsDetailModel>>(
      `${this.apiUrl}?id=${id}`
    );
  }
}
