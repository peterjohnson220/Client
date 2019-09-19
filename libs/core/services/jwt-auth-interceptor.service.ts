import { Injectable, Inject } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as jwtDecode from 'jwt-decode';

import { IntegrationApiService } from 'libs/data/payfactors-api/integration';
import { UseJwtInterceptor } from 'libs/constants';

@Injectable()
export class JwtAuthInterceptor implements HttpInterceptor {

  constructor(private integrationApiService: IntegrationApiService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.headers.has(UseJwtInterceptor)) {
      return next.handle(req);
    }

    const updatedHeaders = req.headers.delete(UseJwtInterceptor);
    req = req.clone({headers: updatedHeaders});

    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      const decodedToken = jwtDecode(jwtToken);
      if (!this.isJwtExpiredOrAboutToExpire(decodedToken.exp)) {
        const headers = req.headers.append('Authorization', `Bearer ${jwtToken}`);
        return next.handle(req.clone({headers}));
      }
    }

    return this.getAuthTokenAndProceed(req, next);
  }

  private isJwtExpiredOrAboutToExpire(expiration: number): boolean {
    if (Date.now() >= (expiration * 1000) || ((Date.now()) >= (expiration - 5 * 60) * 1000)) {
      return true;
    }
    return false;
  }

  private getAuthTokenAndProceed(req: HttpRequest<any>, next: HttpHandler) {
    return this.integrationApiService.fetchAuthToken().pipe(
      switchMap((token: string) => {
        localStorage.setItem('jwtToken', token);
        const headers = req.headers.append('Authorization', `Bearer ${token}`);
        return next.handle(req.clone({headers}));
      })
    );
  }
}
