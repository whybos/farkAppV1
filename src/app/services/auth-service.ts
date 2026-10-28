import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseResponse } from '../model/globalResponseModel';
import { usersModel } from '../model/users.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly EMAIL_STORAGE_KEY = 'fark_logged_in_email';

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

  saveUserEmail(email: string) {
    if (email) {
      localStorage.setItem(this.EMAIL_STORAGE_KEY, email.trim().toLowerCase());
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem(this.EMAIL_STORAGE_KEY);
  }

  validate(): Observable<BaseResponse> {
    return this.httpClient.post<BaseResponse>(
      'https://api.ytufarkk.com/api/Auth/Validate',
      null
    );
  }

  private getDecodedToken(): any | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (e) {
      console.error('Token decode error:', e);
      return null;
    }
  }

  getRole(): string {
    const decoded = this.getDecodedToken();
    if (!decoded) return '';
    return (
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      decoded['role'] ||
      ''
    );
  }

  isSuperAdmin(): boolean {
    const role = this.getRole();
    return role === 'superAdmin' || role.toLowerCase() === 'superadmin';
  }

  getCurrentUserId(): number | null {
    const decoded = this.getDecodedToken();
    if (!decoded) return null;
    const rawId =
      decoded[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ] ??
      decoded['nameid'] ??
      decoded['sub'] ??
      decoded['id'] ??
      decoded['userId'];
    if (rawId !== undefined && rawId !== null && !isNaN(Number(rawId))) {
      return Number(rawId);
    }
    return null;
  }

  getCurrentUserEmail(): string {
    const decoded = this.getDecodedToken();
    const tokenEmail =
      decoded?.[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
      ] ||
      decoded?.['email'] ||
      decoded?.['unique_name'] ||
      decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
      '';
    if (tokenEmail && typeof tokenEmail === 'string' && tokenEmail.includes('@')) {
      return tokenEmail.trim().toLowerCase();
    }
    return (localStorage.getItem(this.EMAIL_STORAGE_KEY) || '').trim().toLowerCase();
  }

  /**
   * SuperAdmin hesabının hiçbir koşulda silinmemesi için çok katmanlı koruma kontrolü.
   */
  isProtectedSuperAdmin(user: usersModel, allUsers?: usersModel[]): boolean {
    if (!user) return false;

    // 1. Kullanıcı nesnesinde role alanı varsa ve superAdmin ise
    const userRole = (
      user.role ||
      user.userRole ||
      (user as any).roleName ||
      ''
    )
      .toString()
      .trim()
      .toLowerCase();
    if (userRole === 'superadmin' || userRole === 'super_admin') {
      return true;
    }

    // 2. Giriş yapmış kişi superAdmin ise ve JWT'deki ID veya E-posta bu kullanıcıyla eşleşiyorsa
    if (this.isSuperAdmin()) {
      const currentId = this.getCurrentUserId();
      if (currentId !== null && Number(user.id) === Number(currentId)) {
        return true;
      }

      const currentEmail = this.getCurrentUserEmail();
      if (
        currentEmail &&
        user.email &&
        user.email.trim().toLowerCase() === currentEmail
      ) {
        return true;
      }
    }

    // 3. E-posta veya ad/soyad içinde açıkça superadmin geçiyorsa
    const emailLower = (user.email || '').trim().toLowerCase();
    const firstNameLower = (user.firstName || '').trim().toLowerCase();
    const lastNameLower = (user.lastName || '').trim().toLowerCase();
    if (
      emailLower.includes('superadmin') ||
      firstNameLower.includes('superadmin') ||
      lastNameLower.includes('superadmin')
    ) {
      return true;
    }

    // 4. Veritabanındaki ilk kurucu hesap (id === 1) her zaman ana SuperAdmin olarak korunur
    if (Number(user.id) === 1) {
      return true;
    }

    // 5. Eğer listedeki hiçbir kullanıcı yukarıdaki kurallarla eşleşmediyse (örn. eski oturum ve farklı ID),
    // en küçük ID'li (ilk oluşturulan) kullanıcıyı SuperAdmin olarak koru
    if (Array.isArray(allUsers) && allUsers.length > 0) {
      const anyExplicitMatch = allUsers.some((u) =>
        this.matchesExplicitSuperAdmin(u)
      );
      if (!anyExplicitMatch) {
        const minId = Math.min(...allUsers.map((u) => Number(u.id)));
        if (Number(user.id) === minId) {
          return true;
        }
      }
    }

    return false;
  }

  private matchesExplicitSuperAdmin(user: usersModel): boolean {
    if (!user) return false;
    const userRole = (
      user.role ||
      user.userRole ||
      (user as any).roleName ||
      ''
    )
      .toString()
      .trim()
      .toLowerCase();
    if (userRole === 'superadmin' || userRole === 'super_admin') return true;

    if (this.isSuperAdmin()) {
      const currentId = this.getCurrentUserId();
      if (currentId !== null && Number(user.id) === Number(currentId)) return true;

      const currentEmail = this.getCurrentUserEmail();
      if (
        currentEmail &&
        user.email &&
        user.email.trim().toLowerCase() === currentEmail
      ) {
        return true;
      }
    }

    const emailLower = (user.email || '').trim().toLowerCase();
    const firstNameLower = (user.firstName || '').trim().toLowerCase();
    const lastNameLower = (user.lastName || '').trim().toLowerCase();
    if (
      emailLower.includes('superadmin') ||
      firstNameLower.includes('superadmin') ||
      lastNameLower.includes('superadmin') ||
      Number(user.id) === 1
    ) {
      return true;
    }

    return false;
  }
}
