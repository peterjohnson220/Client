import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
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
    .pipe(
      ofType(fromLoginAction.LOGIN),
      switchMap((action: fromLoginAction.Login) =>
        this.accountApiService.login(
          { email: action.payload.Email, password: action.payload.Password,
            clientCaptchaSiteKey: action.payload.ClientCaptchaSiteKey, clientCaptchaToken: action.payload.ClientCaptchaToken }).pipe(
          map((response: any) => {
            if (response !== null && response.first_login === 'true') {
              return new fromLoginAction.LoginSuccess(environment.firstTimeLoginPage);
            } else if (response !== null && response.password_expired === true) {
              return new fromLoginAction.PasswordExpired;
            } else if (action.payload.UserVoiceNextPage != null) {
              return new fromLoginAction.LoginSuccessRouteToUserVoice(response.user_id);
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
    .pipe(
      ofType(fromLoginAction.LOGIN_SUCCESS),
      map((action: fromLoginAction.LoginSuccess) => {
          if (action.payload) {
            return new fromLoginAction.LoginSuccessRouteToNextPage(action.payload);
          } else {
            return new fromLoginAction.LoginSuccessRouteToHome();
          }
        }
      )
    );

  @Effect({ dispatch: false })
  LoginSuccessRouteToHome$ = this.actions$
    .pipe(
      ofType(fromLoginAction.LOGIN_SUCCESS_ROUTE_TO_HOME),
      switchMap(() =>
        this.userApiService.getUserHomePageAuthenticated().pipe(
          map((response: any) => this.routeToHomePage(response)),
          catchError(() => of(this.routeToHomePage(null)))
        )
      )
    );

  @Effect({ dispatch: false })
  LoginSuccessRouteToNextPage$ = this.actions$
    .pipe(
      ofType(fromLoginAction.LOGIN_SUCCESS_ROUTE_TO_NEXT_PAGE),
      map((action: fromLoginAction.LoginSuccessRouteToNextPage) => {
        this.routeToNextPage(action.payload);
        }
      )
    );

  @Effect({ dispatch: false })
  LoginSuccessRouteToUserVoice$ = this.actions$
    .pipe(
      ofType(fromLoginAction.LOGIN_SUCCESS_ROUTE_TO_USER_VOICE),
      map((action: fromLoginAction.LoginSuccessRouteToUserVoice) => {
        this.routeToUserVoice(action.payload);
        }
      )
    );

  @Effect({ dispatch: false })
  loginError$ = this.actions$
    .pipe(
      ofType(fromLoginAction.LOGIN_ERROR),
      map((action: fromLoginAction.LoginError) => action.payload),
      map(error => {
          if (error.status === 401) {
            return new fromLoginAction.Login401Error();
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
  routeToUserVoice(userId: string) {
    window.location.href = `${environment.userVoiceLoginRedirect}?userId=${userId}`;
  }
  constructor(private actions$: Actions,
      private accountApiService: AccountApiService,
      private userApiService: UserApiService) { }
}
