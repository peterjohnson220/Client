import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import * as fromFirstLoginAction from '../actions/first-login.action';
import { AccountApiService } from 'libs/data/payfactors-api/auth/account-api.service';
import { UserApiService } from 'libs/data/payfactors-api/user/user-api.service';

@Injectable()
export class FirstLoginEffects {
  defaultHomePage =  `/client/dashboard`;

  @Effect()
  validatingFirstTimeLogin: Observable<Action> = this.actions$
    .ofType(fromFirstLoginAction.VALIDATE_FIRST_LOGIN)
    .switchMap((action: fromFirstLoginAction.ValidateFirstLogin) =>
      this.accountApiService.validateFirstTimeLogin()
        .map((response: any) => new fromFirstLoginAction.ValidateFirstLoginSuccess())
        .catch(error => of (new fromFirstLoginAction.ValidateFirstLoginError()))
    );

  @Effect()
  updatingPassword: Observable<Action> = this.actions$
    .ofType(fromFirstLoginAction.FIRST_LOGIN_UPDATING_PASSWORD)
    .switchMap((action: fromFirstLoginAction.UpdatePassword) =>
      this.accountApiService.updatePassword(action.payload)
        .map(() => new fromFirstLoginAction.UpdatePasswordSuccess())
        .catch(error => of(new fromFirstLoginAction.UpdatePasswordError(error)))
    );

  @Effect({ dispatch: false })
  updatingPasswordSuccess$ = this.actions$
    .ofType(fromFirstLoginAction.FIRST_LOGIN_UPDATING_PASSWORD_SUCCESS)
    .switchMap(() =>
        this.userApiService.getUserHomePageAuthenticated()
          .map((response: any) => this.routeToHomePage(response))
          .catch(() => of(this.routeToHomePage(null)))
    );

  routeToHomePage(url: string) {
    if (url !== undefined && url != null) {
     window.location.href = url;
    } else {
     window.location.href = this.defaultHomePage;
    }
  }

  constructor(private actions$: Actions,
              private accountApiService: AccountApiService,
              private userApiService: UserApiService) { }
}
