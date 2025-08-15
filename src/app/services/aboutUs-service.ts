import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { aboutUsModel } from '../model/aboutUs.model';
import { ListResponse } from '../model/globalResponseModel';

@Injectable({
  providedIn: 'root',
})
export class aboutUsService {
  apiUrl = 'https://localhost:44345/api/AboutUs';

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
}
