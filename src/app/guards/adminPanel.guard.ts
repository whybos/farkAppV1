import { CanActivateFn } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const adminGuard: CanActivateFn = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded: any = jwtDecode(token);
    return decoded?.role === 'admin';
  } catch {
    return false;
  }
};
