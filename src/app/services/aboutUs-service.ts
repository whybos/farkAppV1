import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { aboutUsModel } from '../model/aboutUs.model';
import { ListResponse } from '../model/globalResponseModel';

@Injectable({
  providedIn: 'root',
})
export class aboutUsService {
  apiUrl = 'https://api.ytufarkk.com/api/AboutUs';

  constructor(private httpClient: HttpClient) {}

  getaboutUs(): Observable<ListResponse<aboutUsModel>> {
    return this.httpClient.get<ListResponse<aboutUsModel>>(this.apiUrl);
  }

  createAboutUs(data: aboutUsModel): Observable<ListResponse<aboutUsModel>> {
    return this.httpClient.post<ListResponse<aboutUsModel>>(this.apiUrl, data);
  }

  updateAboutUs(data: aboutUsModel): Observable<ListResponse<aboutUsModel>> {
    return this.httpClient.patch<ListResponse<aboutUsModel>>(this.apiUrl, data);
  }

  deleteAboutUs(id: number): Observable<ListResponse<aboutUsModel>> {
    return this.httpClient.delete<ListResponse<aboutUsModel>>(
      `${this.apiUrl}?id=${id}`
    );
  }

  deleteAllAboutUs(): Observable<number> {
    return this.httpClient.delete(`${this.apiUrl}/deleteAll`).pipe(
      catchError(() => of(null)),
      switchMap(() =>
        this.getaboutUs().pipe(
          catchError(() => of({ success: false, message: '', data: [] as aboutUsModel[] }))
        )
      ),
      switchMap((resp) => {
        const items = Array.isArray(resp?.data) ? resp.data : [];
        if (items.length === 0) return of(0);
        return forkJoin(
          items.map((item) =>
            this.deleteAboutUs(item.id).pipe(catchError(() => of(null)))
          )
        ).pipe(map(() => items.length));
      })
    );
  }
}
