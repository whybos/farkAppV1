import { Injectable } from '@angular/core';
import { BlogModel } from '../model/blog.model';
import { map, Observable } from 'rxjs';
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
}
