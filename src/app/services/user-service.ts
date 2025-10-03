import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponse } from '../model/globalResponseModel';
import { HttpClient } from '@angular/common/http';
import { usersModel } from '../model/users.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl: string = 'https://api.ytufarkk.com/api/User';
  constructor(private httpClient: HttpClient) {}

  getUser(): Observable<ListResponse<usersModel>> {
    return this.httpClient.get<ListResponse<usersModel>>(
      'https://api.ytufarkk.com/api/Auth/getAll'
    );
  }
  createUser(data: usersModel): Observable<ListResponse<usersModel>> {
    return this.httpClient.post<ListResponse<usersModel>>(
      'https://api.ytufarkk.com/api/Auth/register',
      data
    );
  }

  deleteUser(id: number): Observable<ListResponse<usersModel>> {
    return this.httpClient.delete<ListResponse<usersModel>>(
      `https://api.ytufarkk.com/api/Auth/delete/{id}`
    );
  }
}
