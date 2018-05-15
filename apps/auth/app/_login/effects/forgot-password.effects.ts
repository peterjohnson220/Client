import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

import * as fromForgotPasswordAction from '../actions/forgot-password.actions';
import { ForgotPasswordApiService } from 'libs/data/payfactors-api/auth/forgot-password-api.service';


@Injectable()
export class ForgotPasswordEffects {
  @Effect()
  sendingPasswordReset$: Observable<Action> = this.actions$
    .ofType(fromForgotPasswordAction.SENDING_PASSWORD_RESET)
    .switchMap((action: fromForgotPasswordAction.SendingPasswordReset) =>
      this.forgotPasswordApiService.sendPasswordReset(action.payload)
        .map((response: any) => new fromForgotPasswordAction.SendingPasswordResetSuccess())
        .catch(error => of(new fromForgotPasswordAction.SendingPasswordResetError()))
    );

  constructor(
    private actions$: Actions,
    private forgotPasswordApiService: ForgotPasswordApiService
  ) {
  }
}
