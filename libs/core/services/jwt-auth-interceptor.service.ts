import { Injectable, OnDestroy } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as jwtDecode from 'jwt-decode';

import { IntegrationApiService } from 'libs/data/payfactors-api/integration';
import { UseJwtInterceptor } from 'libs/constants';

import * as fromRootState from '../../state/state';
import {UserContext} from '../../models/security';

@Injectable()
export class JwtAuthInterceptor implements HttpInterceptor, OnDestroy {
  private userContext: UserContext;
  private userContextSubscription: Subscription;

  constructor(private integrationApiService: IntegrationApiService, private store: Store<fromRootState.State>) {
    this.userContextSubscription = this.store.select(fromRootState.getUserContext).subscribe(uc => {
      this.userContext = uc;
    });
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
      if (!this.isJwtExpiredOrAboutToExpire(decodedToken.exp) && this.isSameUser(decodedToken, this.userContext)) {
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

  private isSameUser(jwt: any, userContext: UserContext) {
    return jwt.UserId === userContext.UserId.toString() ? true : false;
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

  ngOnDestroy() {
    this.userContextSubscription.unsubscribe();
  }
}
