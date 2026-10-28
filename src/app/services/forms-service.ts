import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListResponse } from '../model/globalResponseModel';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { formsModel } from '../model/forms.model';

@Injectable({
  providedIn: 'root',
})
export class FormsService {
  apiUrl = 'https://api.ytufarkk.com/api/FormsActive';
  constructor(private httpClient: HttpClient) {}

  getforms(): Observable<ListResponse<formsModel>> {
    return this.httpClient.get<ListResponse<formsModel>>(this.apiUrl);
  }
  createForms(data: formsModel): Observable<ListResponse<formsModel>> {
    return this.httpClient.post<ListResponse<formsModel>>(this.apiUrl, data);
  }

  updateForms(data: formsModel): Observable<ListResponse<formsModel>> {
    return this.httpClient.patch<ListResponse<formsModel>>(this.apiUrl, data);
  }

  deleteForms(id: number): Observable<ListResponse<formsModel>> {
    return this.httpClient.delete<ListResponse<formsModel>>(
      `${this.apiUrl}?id=${id}`
    );
  }

  deleteAllForms(): Observable<number> {
    return this.httpClient.delete(`${this.apiUrl}/deleteAll`).pipe(
      catchError(() => of(null)),
      switchMap(() =>
        this.getforms().pipe(
          catchError(() => of({ success: false, message: '', data: [] as formsModel[] }))
        )
      ),
      switchMap((resp) => {
        const items = Array.isArray(resp?.data) ? resp.data : [];
        if (items.length === 0) return of(0);
        return forkJoin(
          items.map((item) =>
            this.deleteForms(item.id).pipe(catchError(() => of(null)))
          )
        ).pipe(map(() => items.length));
      })
    );
  }
}
