import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { tap, switchMap, map, catchError } from 'rxjs/operators';

import { CompanySecurityApiService } from '../../../data/payfactors-api';
import * as userContextActions from '../actions/user-context.actions';

@Injectable()
export class UserContextEffects {

  @Effect()
  getUserContext$ = this.actions$
    .ofType(userContextActions.GET_USER_CONTEXT).pipe(
      switchMap(() =>
        this.companySecurityApiService.getIdentity().pipe(
          map((identity: any) => new userContextActions.GetUserContextSuccess(identity)),
          catchError(error => {
            return of(new userContextActions.GetUserContextError(error));
          })
        )
      )
    );

  @Effect()
  getUserContextError$ = this.actions$
    .ofType(userContextActions.GET_USER_CONTEXT_ERROR).pipe(
      map((action: userContextActions.GetUserContextError) => action.error),
      map(error => {
          if (error.status === 401) {
            return new userContextActions.GetUserContext401Error();
          } else if (error.status === 404) {
            return new userContextActions.GetUserContext404Error();
          }
        }
      )
    );

  @Effect({ dispatch: false })
  getUserContext401Error$ = this.actions$
    .ofType(userContextActions.GET_USER_CONTEXT_401_ERROR).pipe(
      tap((action: userContextActions.GetUserContext401Error) => {
          if (isPlatformBrowser(this.platformId)) {
            window.location.href = `/`;
          }
          return null;
        }
      )
    );

  @Effect({ dispatch: false })
  getUserContext404Error$ = this.actions$
    .ofType(userContextActions.GET_USER_CONTEXT_404_ERROR).pipe(
      tap((action: userContextActions.GetUserContext404Error) => {
          if (isPlatformBrowser(this.platformId)) {
            this.router.navigate(['/not-found']);
          }
          return null;
        }
      )
    );

  constructor(private actions$: Actions,
              private companySecurityApiService: CompanySecurityApiService,
              private router: Router,
              @Inject(PLATFORM_ID) private platformId: Object) {
  }
}
