import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ListResponse } from '../model/globalResponseModel';
import { farkindaModel } from '../model/farkinda.model';

@Injectable({
  providedIn: 'root',
})
export class FarkindaService {
  apiUrl = 'https://api.ytufarkk.com/api/Farkinda';

  constructor(private httpClient: HttpClient) {}

  getFarkinda(): Observable<ListResponse<farkindaModel>> {
    return this.httpClient.get<ListResponse<farkindaModel>>(this.apiUrl);
  }

  createFarkinda(data: farkindaModel): Observable<ListResponse<farkindaModel>> {
    return this.httpClient.post<ListResponse<farkindaModel>>(this.apiUrl, data);
  }

  updateFarkinda(data: farkindaModel): Observable<ListResponse<farkindaModel>> {
    return this.httpClient.put<ListResponse<farkindaModel>>(this.apiUrl, data);
  }

  deleteFarkinda(id: number): Observable<ListResponse<farkindaModel>> {
    return this.httpClient.delete<ListResponse<farkindaModel>>(
      `${this.apiUrl}?id=${id}`
    );
  }

  deleteAllFarkinda(): Observable<number> {
    return this.getFarkinda().pipe(
      catchError(() => of({ success: false, data: [] as farkindaModel[], message: '' })),
      switchMap((resp) => {
        const items = Array.isArray(resp?.data) ? resp.data : [];
        if (items.length === 0) return of(0);
        return forkJoin(
          items.map((item) =>
            this.deleteFarkinda(item.id).pipe(catchError(() => of(null)))
          )
        ).pipe(map(() => items.length));
      })
    );
  }
}
