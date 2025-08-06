import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListResponse } from '../model/globalResponseModel';
import { Observable } from 'rxjs';
import { formsModel } from '../model/forms.model';

@Injectable({
  providedIn: 'root',
})
export class FormsService {
  apiUrl = 'https://localhost:44345/api/FormsActive';
  constructor(private httpClient: HttpClient) {}

  getforms(): Observable<ListResponse<formsModel>> {
    return this.httpClient.get<ListResponse<formsModel>>(this.apiUrl);
  }
}
