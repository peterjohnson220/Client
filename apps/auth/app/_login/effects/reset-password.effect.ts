import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AccountApiService } from 'libs/data/payfactors-api/auth/account-api.service';

import * as fromResetPasswordAction from '../actions/reset-password.actions';

@Injectable()
export class ResetPasswordEffects {
  @Effect()
  sendingPasswordReset$: Observable<Action> = this.actions$
    .ofType(fromResetPasswordAction.RESET_PASSWORD).pipe(
      switchMap((action: fromResetPasswordAction.ResetPassword) =>
        this.accountApiService.resetPassword(action.payload.token, action.payload.password).pipe(
          map((response: any) => {
            if (response === 'token_expired') {
              return new fromResetPasswordAction.ResetPasswordTokenExpired();
            } else {
              return new fromResetPasswordAction.ResetPasswordSuccess();
            }
          }),
          catchError(error => of(new fromResetPasswordAction.ResetPasswordError()))
        )
      )
    );


  @Effect()
  checkingResetPasswordToken$: Observable<Action> = this.actions$
    .ofType(fromResetPasswordAction.CHECK_RESET_PASSWORD_TOKEN).pipe(
      switchMap((action: fromResetPasswordAction.CheckResetPasswordToken) =>
        this.accountApiService.checkPasswordResetToken(action.payload).pipe(
          map((response: any) => {
              return new fromResetPasswordAction.CheckResetPasswordTokenSuccess(response);
            }
          ),
          catchError(error => of(new fromResetPasswordAction.ResetPasswordError()))
        )
      ));

  constructor(
    private actions$: Actions,
    private accountApiService: AccountApiService
  ) {
  }
}
