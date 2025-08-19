import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse } from '../model/globalResponseModel';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  login(data: { email: string; password: string }) {
    return this.httpClient.post<any>(
      'https://api.ytufarkk.com/api/Auth/login',
      data
    );
  }

  register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return this.httpClient.post<any>('/api/Auth/register', data);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  validate(): Observable<BaseResponse> {
    return this.httpClient.post<BaseResponse>(
      'https://api.ytufarkk.com/api/Auth/Validate',
      null
    );
  }
  getRole(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      const decoded: any = jwtDecode(token);
      return (
        decoded[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ] || ''
      );
    } catch (e) {
      console.error('Token decode error:', e);
      return '';
    }
  }
}
