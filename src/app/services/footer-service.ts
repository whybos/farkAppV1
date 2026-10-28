import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { footerModel } from '../model/footer.model';
import { ListResponse } from '../model/globalResponseModel';

@Injectable({
  providedIn: 'root',
})
export class FooterService {
  apiUrl = 'https://api.ytufarkk.com/api/Footer';
  constructor(private httpClient: HttpClient) {}

  getfooter(): Observable<ListResponse<footerModel>> {
    return this.httpClient.get<ListResponse<footerModel>>(this.apiUrl);
  }
  createFooter(data: footerModel): Observable<ListResponse<footerModel>> {
    return this.httpClient.post<ListResponse<footerModel>>(this.apiUrl, data);
  }

  updateFooter(data: footerModel): Observable<ListResponse<footerModel>> {
    return this.httpClient.patch<ListResponse<footerModel>>(this.apiUrl, data);
  }

  deleteFooter(id: number): Observable<ListResponse<footerModel>> {
    return this.httpClient.delete<ListResponse<footerModel>>(
      `${this.apiUrl}?id=${id}`
    );
  }

  deleteAllFooter(): Observable<number> {
    return this.httpClient.delete(`${this.apiUrl}/deleteAll`).pipe(
      catchError(() => of(null)),
      switchMap(() =>
        this.getfooter().pipe(
          catchError(() => of({ success: false, message: '', data: [] as footerModel[] }))
        )
      ),
      switchMap((resp) => {
        const items = Array.isArray(resp?.data) ? resp.data : [];
        if (items.length === 0) return of(0);
        return forkJoin(
          items.map((item) =>
            this.deleteFooter(item.id).pipe(catchError(() => of(null)))
          )
        ).pipe(map(() => items.length));
      })
    );
  }
}
