import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListResponse } from '../model/globalResponseModel';
import { Observable } from 'rxjs';
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
}
