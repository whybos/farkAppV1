import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponse } from '../model/globalResponseModel';
import { HttpClient } from '@angular/common/http';
import { usersModel } from '../model/users.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = 'https://api.ytufarkk.com/api/Auth';

  constructor(private httpClient: HttpClient) {}

  getUser(): Observable<ListResponse<usersModel>> {
    return this.httpClient.get<ListResponse<usersModel>>(
      `${this.baseUrl}/getAll`
    );
  }

  createUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/register`, data, {
      responseType: 'text',
    });
  }

  deleteUser(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/delete/${id}`, {
      responseType: 'text',
    });
  }

  resetUsers(): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/resetUsers`, null, {
      responseType: 'text',
    });
  }

  resetDatabase(): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/resetDatabase`, null, {
      responseType: 'text',
    });
  }
}
