import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import { AccountApiService } from 'libs/data/payfactors-api/auth/account-api.service';
import { UserApiService } from 'libs/data/payfactors-api/user/user-api.service';
import { environment } from 'environments/environment';

import * as fromLoginAction from '../actions/login.actions';

@Injectable()
export class LoginEffects {
  @Effect()
  login: Observable<Action> = this.actions$
    .ofType(fromLoginAction.LOGIN).pipe(
      switchMap((action: fromLoginAction.Login) =>
        this.accountApiService.login({ email: action.payload.Email, password: action.payload.Password }).pipe(
          map((response: any) => {
            if (response !== null && response.first_login === 'true') {
              return new fromLoginAction.LoginSuccess(environment.firstTimeLoginPage);
            } else {
              return new fromLoginAction.LoginSuccess(action.payload.NextPage);
            }
          }),
          catchError(error => of (new fromLoginAction.LoginError(error)))
        )
      )
    );

  @Effect()
  loginSuccess$ = this.actions$
    .ofType(fromLoginAction.LOGIN_SUCCESS).pipe(
      switchMap((action: fromLoginAction.LoginSuccess) => {
          if (action.nextPage) {
            return of(new fromLoginAction.LoginSuccessRouteToNextPage(action.nextPage));
          } else {
            return of(new fromLoginAction.LoginSuccessRouteToHome());
          }
        }
      )
    );

  @Effect({ dispatch: false })
  LoginSuccessRouteToHome$ = this.actions$
    .ofType(fromLoginAction.LOGIN_SUCCESS_ROUTE_TO_HOME).pipe(
      switchMap(() =>
        this.userApiService.getUserHomePageAuthenticated().pipe(
          map((response: any) => this.routeToHomePage(response)),
          catchError(() => of(this.routeToHomePage(null)))
        )
      )
    );

  @Effect({ dispatch: false })
  LoginSuccessRouteToNextPage$ = this.actions$
    .ofType(fromLoginAction.LOGIN_SUCCESS_ROUTE_TO_NEXT_PAGE).pipe(
      map((action: fromLoginAction.LoginSuccessRouteToNextPage) => {
        this.routeToNextPage(action.nextPage);
        }
      )
    );

  @Effect({ dispatch: false })
  loginError$ = this.actions$
    .ofType(fromLoginAction.LOGIN_ERROR).pipe(
      map((action: fromLoginAction.LoginError) => action.error),
      switchMap(error => {
          if (error.status === 401) {
            return of(new fromLoginAction.Login401Error());
          }
        }
      )
    );

  routeToHomePage(url: string) {
    if (url !== undefined && url != null) {
      window.location.href = url + '?login=true';
    } else {
      window.location.href = environment.defaultHomePage;
    }
  }
  routeToNextPage(nextPage: string) {
      window.location.href = nextPage;
  }
  constructor(private actions$: Actions,
      private accountApiService: AccountApiService,
      private userApiService: UserApiService) { }
}
