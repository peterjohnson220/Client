import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AccountApiService } from 'libs/data/payfactors-api/auth/account-api.service';

import * as fromResetPasswordAction from '../actions/reset-password.actions';

@Injectable()
export class ResetPasswordEffects {
  @Effect()
  sendingPasswordReset$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromResetPasswordAction.RESET_PASSWORD),
      switchMap((action: fromResetPasswordAction.ResetPassword) =>
        this.accountApiService.resetPassword(action.payload.token, action.payload.password).pipe(
          map((response: any) => {
            if (response === 'token_expired') {
              return new fromResetPasswordAction.ResetPasswordTokenExpired();
            } else if (response === 'password_used') {
              return new fromResetPasswordAction.ResetPasswordAlreadyUsed();
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
    .pipe(
      ofType(fromResetPasswordAction.CHECK_RESET_PASSWORD_TOKEN),
      switchMap((action: fromResetPasswordAction.CheckResetPasswordToken) =>
        this.accountApiService.checkPasswordResetToken(action.payload).pipe(
          map((response: any) => {
              const payload: any = {
                TokenIsValid: response.TokenIsValid,
                MinimumLength: response.MinimumLength,
                Username: response.Username
              };
              return new fromResetPasswordAction.CheckResetPasswordTokenSuccess(payload);
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
