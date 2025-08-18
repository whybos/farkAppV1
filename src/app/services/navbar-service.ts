import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { navbarModel } from '../model/navbar.model';
import { ListResponse, SingleResponse } from '../model/globalResponseModel';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  apiUrl = 'https://localhost:5001/api/Navbar';
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
}
