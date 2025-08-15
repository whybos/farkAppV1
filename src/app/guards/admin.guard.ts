import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth-service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.validate().pipe(
      map((resp) => {
        if (resp.success === true) {
          return true;
        } else {
          return this.router.createUrlTree(['/']);
        }
      }),
      catchError((err) => {
        return of(this.router.createUrlTree(['/']));
      })
    );
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.validate().pipe(
      map((resp) => {
        if (resp.success === true) {
          return true;
        } else {
          return this.router.createUrlTree(['/']);
        }
      }),
      catchError((err) => {
        return of(this.router.createUrlTree(['/']));
      })
    );
  }
}
