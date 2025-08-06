import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { footerModel } from '../model/footer.model';
import { ListResponse } from '../model/globalResponseModel';

@Injectable({
  providedIn: 'root',
})
export class FooterService {
  apiUrl = 'https://localhost:44345/api/Footer';
  constructor(private httpClient: HttpClient) {}

  getfooter(): Observable<ListResponse<footerModel>> {
    return this.httpClient.get<ListResponse<footerModel>>(this.apiUrl);
  }
}
