import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { newsModel } from '../model/news.model';
import { ListResponse } from '../model/globalResponseModel';
import { newsDetailService } from './newsDetail-service';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  apiUrl: string = 'https://api.ytufarkk.com/api/News';
  private readonly detailService = inject(newsDetailService);

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

  deleteAllNews(): Observable<number> {
    return forkJoin([
      this.httpClient.delete(`${this.apiUrl}/deleteAll`).pipe(catchError(() => of(null))),
      this.detailService.deleteAllDetails().pipe(catchError(() => of(null))),
    ]).pipe(
      switchMap(() =>
        this.getNews().pipe(
          catchError(() => of({ success: false, message: '', data: [] as newsModel[] }))
        )
      ),
      switchMap((resp) => {
        const items = Array.isArray(resp?.data) ? resp.data : [];
        if (items.length === 0) return of(0);
        return forkJoin(
          items.map((item) =>
            forkJoin([
              this.detailService.deleteDetail(item.id).pipe(catchError(() => of(null))),
              this.deleteNews(item.id).pipe(catchError(() => of(null))),
            ])
          )
        ).pipe(map(() => items.length));
      })
    );
  }
}
