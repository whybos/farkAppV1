import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { newsModel } from '../model/news.model';
import { ListResponse } from '../model/globalResponseModel';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  apiUrl: string = 'https://localhost:44345/api/News';

  constructor(private httpClient: HttpClient) {}

  getNews(): Observable<ListResponse<newsModel>> {
    return this.httpClient.get<ListResponse<newsModel>>(this.apiUrl);
  }
  createNews(data: newsModel): Observable<ListResponse<newsModel>> {
    return this.httpClient.post<ListResponse<newsModel>>(this.apiUrl, data);
  }

  updateNews(data: newsModel): Observable<ListResponse<newsModel>> {
    return this.httpClient.patch<ListResponse<newsModel>>(this.apiUrl, data);
  }

  deleteNews(id: number): Observable<ListResponse<newsModel>> {
    return this.httpClient.delete<ListResponse<newsModel>>(
      `${this.apiUrl}?id=${id}`
    );
  }
}
