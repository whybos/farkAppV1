import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { footerModel } from '../model/footer.model';
import { ListResponse } from '../model/globalResponseModel';

@Injectable({
  providedIn: 'root',
})
export class FooterService {
  apiUrl = 'https://api.ytufarkk.com/api/Footer';
  constructor(private httpClient: HttpClient) {}

  getfooter(): Observable<ListResponse<footerModel>> {
    return this.httpClient.get<ListResponse<footerModel>>(this.apiUrl);
  }
  createFooter(data: footerModel): Observable<ListResponse<footerModel>> {
    return this.httpClient.post<ListResponse<footerModel>>(this.apiUrl, data);
  }

  updateFooter(data: footerModel): Observable<ListResponse<footerModel>> {
    return this.httpClient.patch<ListResponse<footerModel>>(this.apiUrl, data);
  }

  deleteFooter(id: number): Observable<ListResponse<footerModel>> {
    return this.httpClient.delete<ListResponse<footerModel>>(
      `${this.apiUrl}?id=${id}`
    );
  }
}
