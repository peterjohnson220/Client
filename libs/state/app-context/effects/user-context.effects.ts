import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { tap, switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { CompanySecurityApiService } from '../../../data/payfactors-api';
import { UrlRedirectRequest } from '../../../models/url-redirect';
import { UrlRedirectHelper } from '../../../core/helpers/url-redirect-helper';
import { UserContext } from '../../../models/security/user-context.model';

import * as userContextActions from '../actions/user-context.actions';
import * as fromFeatureFlagRedirectActions from '../actions/feature-flag-redirect.action';
import * as userContextReducer from '../reducers/user-context.reducer';
import * as fromRootState from '../../state';

@Injectable()
export class UserContextEffects {

  @Effect()
  getUserContext$ = this.actions$
    .pipe(
      ofType(userContextActions.GET_USER_CONTEXT),
      switchMap(() =>
        this.companySecurityApiService.getIdentity().pipe(
          map((identity: any) => new userContextActions.GetUserContextSuccess(identity)),
          catchError(error => {
            const redirectToAfterSuccessfulLogin = window.location.pathname + window.location.search;
            return of(new userContextActions.GetUserContextError({ error: error, redirectUrl: redirectToAfterSuccessfulLogin }));
          })
        )
      )
    );

  @Effect()
  getUserContextSuccess$ = this.actions$
    .pipe(
      ofType(userContextActions.GET_USER_CONTEXT_SUCCESS),
      // wherever there is a userContext, there should also be feature flag redirects
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
        (action, userContext: UserContext) => {
          return { action, userContext };
        }),
      map((data) => {
        return data.userContext.IsPublic ? { type: 'No Action' } :
          new fromFeatureFlagRedirectActions.GetUserRedirectUrls(this.generateUrlRedirectRequests());
      })
    );

  @Effect()
  getUserContextError$ = this.actions$
    .pipe(
      ofType(userContextActions.GET_USER_CONTEXT_ERROR),
      map((action: userContextActions.GetUserContextError) => action.errorContext),
      map(errorContext => {
        if (errorContext.error.status === 401) {
          return new userContextActions.GetUserContext401Error(errorContext.redirectUrl);
        } else if (errorContext.error.status === 404) {
          return new userContextActions.GetUserContext404Error();
        } else if (errorContext.error.status === 403) {
          return new userContextActions.GetUserContext403Error({ errorMessage: errorContext.error.error.error.message });
        } else if (errorContext.error.status === 410) {
          return new userContextActions.GetUserContext410Error();
        } else if (errorContext.error.status === 500) {
          return new userContextActions.GetUserContext500Error();
        }
      })
    );

  @Effect({ dispatch: false })
  getUserContext401Error$ = this.actions$
    .pipe(
      ofType(userContextActions.GET_USER_CONTEXT_401_ERROR),
      tap((action: userContextActions.GetUserContext401Error) => {
        if (isPlatformBrowser(this.platformId)) {
          window.location.href = `/?redirect=` + encodeURIComponent(action.redirect);
        }
        return null;
      })
    );

  @Effect({ dispatch: false })
  getUserContext403Error$ = this.actions$
    .pipe(
      ofType(userContextActions.GET_USER_CONTEXT_403_ERROR),
      tap((action: userContextActions.GetUserContext403Error) => {
        if (isPlatformBrowser(this.platformId)) {
          this.router.navigate(['/forbidden']);
        }
      })
    );

  @Effect({ dispatch: false })
  getUserContext404Error$ = this.actions$
    .pipe(
      ofType(userContextActions.GET_USER_CONTEXT_404_ERROR),
      tap((action: userContextActions.GetUserContext404Error) => {
        if (isPlatformBrowser(this.platformId)) {
          this.router.navigate(['/not-found']);
        }
        return null;
      })
    );

  @Effect({ dispatch: false })
  getUserContext410Error$ = this.actions$
    .pipe(
      ofType(userContextActions.GET_USER_CONTEXT_410_ERROR),
      tap((action: userContextActions.GetUserContext410Error) => {
        if (isPlatformBrowser(this.platformId)) {
          this.router.navigate(['/gone']);
        }
        return null;
      })
    );

  @Effect({ dispatch: false })
  getUserContext500Error$ = this.actions$
    .pipe(
      ofType(userContextActions.GET_USER_CONTEXT_500_ERROR),
      tap((action: userContextActions.GetUserContext500Error) => {
        if (isPlatformBrowser(this.platformId)) {
          this.router.navigate(['/server-error']);
        }
        return null;
      })
    );

  constructor(private actions$: Actions,
    private companySecurityApiService: CompanySecurityApiService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private store: Store<userContextReducer.State>) {
  }

  private generateUrlRedirectRequests(): UrlRedirectRequest[] {
    const requestArr: UrlRedirectRequest[] = [];

    requestArr.push(UrlRedirectHelper.getPricingProjectUrlRedirectRequest());
    requestArr.push(UrlRedirectHelper.getProjectListUrlRedirectRequest());

    return requestArr;
  }
}
