import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { navbarModel } from '../model/navbar.model';
import { ListResponse } from '../model/globalResponseModel';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  apiUrl = 'https://api.ytufarkk.com/api/Navbar';
  constructor(private httpClient: HttpClient) {}

  getnavbar(): Observable<ListResponse<navbarModel>> {
    return this.httpClient.get<ListResponse<navbarModel>>(this.apiUrl);
  }
  createNavbar(data: navbarModel): Observable<ListResponse<navbarModel>> {
    return this.httpClient.post<ListResponse<navbarModel>>(this.apiUrl, data);
  }

  updateNavbar(data: navbarModel): Observable<ListResponse<navbarModel>> {
    return this.httpClient.patch<ListResponse<navbarModel>>(this.apiUrl, data);
  }

  deleteNavbar(id: number): Observable<ListResponse<navbarModel>> {
    return this.httpClient.delete<ListResponse<navbarModel>>(
      `${this.apiUrl}?id=${id}`
    );
  }

  deleteAllNavbar(): Observable<number> {
    return this.httpClient.delete(`${this.apiUrl}/deleteAll`).pipe(
      catchError(() => of(null)),
      switchMap(() =>
        this.getnavbar().pipe(
          catchError(() => of({ success: false, message: '', data: [] as navbarModel[] }))
        )
      ),
      switchMap((resp) => {
        const items = Array.isArray(resp?.data) ? resp.data : [];
        if (items.length === 0) return of(0);
        return forkJoin(
          items.map((item) =>
            this.deleteNavbar(item.id).pipe(catchError(() => of(null)))
          )
        ).pipe(map(() => items.length));
      })
    );
  }
}
