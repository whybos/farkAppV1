import { Injectable } from '@angular/core';
import { BlogModel } from '../model/blog.model';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ListResponse } from '../model/globalResponseModel';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  apiUrl = 'https://localhost:44345/api/Blog';

  constructor(private httpClient: HttpClient) {}

  getBlog(): Observable<ListResponse<BlogModel>> {
    return this.httpClient.get<ListResponse<BlogModel>>(this.apiUrl);
  }
}
