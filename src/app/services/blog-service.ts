import { Injectable } from '@angular/core';
import { BlogModel } from '../model/blog.model';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ListResponse } from '../model/globalResponseModel';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  apiUrl = 'https://api.ytufarkk.com/api/Blog';

  constructor(private httpClient: HttpClient) {}

  getBlog(): Observable<ListResponse<BlogModel>> {
    return this.httpClient.get<ListResponse<BlogModel>>(this.apiUrl);
  }
  createBlog(data: BlogModel): Observable<ListResponse<BlogModel>> {
    return this.httpClient.post<ListResponse<BlogModel>>(this.apiUrl, data);
  }

  updateBlog(data: BlogModel): Observable<ListResponse<BlogModel>> {
    return this.httpClient.patch<ListResponse<BlogModel>>(this.apiUrl, data);
  }

  deleteBlog(id: number): Observable<ListResponse<BlogModel>> {
    return this.httpClient.delete<ListResponse<BlogModel>>(
      `${this.apiUrl}?id=${id}`
    );
  }

  deleteAllBlogs(): Observable<number> {
    return this.httpClient.delete(`${this.apiUrl}/deleteAll`).pipe(
      catchError(() => of(null)),
      switchMap(() =>
        this.getBlog().pipe(
          catchError(() => of({ success: false, message: '', data: [] as BlogModel[] }))
        )
      ),
      switchMap((resp) => {
        const items = Array.isArray(resp?.data) ? resp.data : [];
        if (items.length === 0) return of(0);
        return forkJoin(
          items.map((item) =>
            this.deleteBlog(item.id).pipe(catchError(() => of(null)))
          )
        ).pipe(map(() => items.length));
      })
    );
  }
}
