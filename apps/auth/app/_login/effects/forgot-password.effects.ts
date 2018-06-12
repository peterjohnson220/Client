import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AccountApiService } from 'libs/data/payfactors-api/auth/account-api.service';

import * as fromForgotPasswordAction from '../actions/forgot-password.actions';

@Injectable()
export class ForgotPasswordEffects {
  @Effect()
  sendingPasswordReset$: Observable<Action> = this.actions$
    .ofType(fromForgotPasswordAction.SENDING_PASSWORD_RESET).pipe(
      switchMap((action: fromForgotPasswordAction.SendingPasswordReset) =>
        this.accountApiService.sendPasswordReset(action.payload).pipe(
          map((response: any) => new fromForgotPasswordAction.SendingPasswordResetSuccess()),
          catchError(error => of(new fromForgotPasswordAction.SendingPasswordResetError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private accountApiService: AccountApiService
  ) {
  }
}
