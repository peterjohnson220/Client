import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';

import { Observable, of } from 'rxjs';
import { map, first, mergeMap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromRoot from '../state';
import { UserContext } from '../models';
import { environment } from '../../../../../environments/environment';

const BASE_APP_URL = environment.smallBusinessAppUrl;

@Injectable()
export class ApiAuthInterceptor implements HttpInterceptor {
  apiAccessToken$: Observable<string>;

  constructor(store: Store<fromRoot.AppState>, @Inject(DOCUMENT) private document: any, private location: Location) {
    this.apiAccessToken$ = store.select(fromRoot.selectUserContextModel).pipe(
      map((userContext: UserContext) => {
        if (userContext && userContext.apiAccessToken) {
          return userContext.apiAccessToken;
        } else {
          return null;
        }
      })
    );
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.apiAccessToken$.pipe(
      first(),
      mergeMap((token: string) => {
        const authRequest = !!token ? req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + token)
        }) : req;
        return next.handle(authRequest).pipe(
          catchError(error => {
            if (error.status === 401) {
              this.document.location.href = `${BASE_APP_URL}login?state=${this.location.path()}`;
              return of(error);
            }
            throw error;
          })
        );
      })
    );
  }
}
