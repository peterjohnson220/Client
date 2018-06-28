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
        this.accountApiService.login(action.payload).pipe(
          map((response: any) => new fromLoginAction.LoginSuccess()),
          catchError(error => of (new fromLoginAction.LoginError(error)))
        )
      )
    );

  @Effect({ dispatch: false })
  loginSuccess$ = this.actions$
    .ofType(fromLoginAction.LOGIN_SUCCESS).pipe(
      switchMap(() =>
        this.userApiService.getUserHomePageAuthenticated().pipe(
          map((response: any) => this.routeToHomePage(response)),
          catchError(() => of(this.routeToHomePage(null)))
        )
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
      window.location.href = url;
    } else {
      window.location.href = environment.defaultHomePage;
    }
  }
  constructor(private actions$: Actions,
      private accountApiService: AccountApiService,
      private userApiService: UserApiService) { }
}
