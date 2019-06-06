import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import { AccountApiService } from 'libs/data/payfactors-api/auth/account-api.service';
import { UserApiService } from 'libs/data/payfactors-api/user/user-api.service';
import { environment } from 'environments/environment';


import * as fromFirstLoginAction from '../actions/first-login.action';

@Injectable()
export class FirstLoginEffects {
  @Effect()
  validatingFirstTimeLogin: Observable<Action> = this.actions$
    .pipe(
      ofType(fromFirstLoginAction.VALIDATE_FIRST_LOGIN),
      switchMap((action: fromFirstLoginAction.ValidateFirstLogin) =>
        this.accountApiService.validateFirstTimeLogin().pipe(
          map((response: any) => new fromFirstLoginAction.ValidateFirstLoginSuccess()),
          catchError(error => of (new fromFirstLoginAction.ValidateFirstLoginError()))
        )
      )
    );

  @Effect()
  updatingPassword: Observable<Action> = this.actions$
    .pipe(
      ofType(fromFirstLoginAction.FIRST_LOGIN_UPDATING_PASSWORD),
      switchMap((action: fromFirstLoginAction.UpdatePassword) =>
        this.accountApiService.updatePassword(action.payload).pipe(
          map(() => new fromFirstLoginAction.UpdatePasswordSuccess()),
          catchError(error => of(new fromFirstLoginAction.UpdatePasswordError(error)))
        )
    ));

  @Effect({ dispatch: false })
  updatingPasswordSuccess$ = this.actions$
    .pipe(
      ofType(fromFirstLoginAction.FIRST_LOGIN_UPDATING_PASSWORD_SUCCESS),
      switchMap(() =>
          this.userApiService.getUserHomePageAuthenticated().pipe(
            map((response: any) => this.routeToHomePage(response)),
            catchError(() => of(this.routeToHomePage(null)))
          )
      )
    );

  routeToHomePage(url: string) {
    if (url !== undefined && url != null) {
      window.location.href = url + '?login=true';
    } else {
      window.location.href = environment.defaultHomePage;
    }
  }

  constructor(private actions$: Actions,
              private accountApiService: AccountApiService,
              private userApiService: UserApiService) { }
}
