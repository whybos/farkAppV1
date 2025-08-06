import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { navbarModel } from '../model/navbar.model';
import { ListResponse } from '../model/globalResponseModel';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  apiUrl = 'https://localhost:44345/api/Navbar';
  constructor(private httpClient: HttpClient) {}

  getnavbar(): Observable<ListResponse<navbarModel>> {
    return this.httpClient.get<ListResponse<navbarModel>>(this.apiUrl);
  }
}
