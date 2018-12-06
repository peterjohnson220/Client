import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AccountApiService } from 'libs/data/payfactors-api/auth/account-api.service';

import * as fromValidateRegistrationActions from '../actions/validate-registration.actions';

@Injectable()
export class ValidateRegistrationEffects {
  @Effect()
  validateRegistrationToken$: Observable<Action> = this.actions$
    .ofType(fromValidateRegistrationActions.VALIDATE_TOKEN).pipe(
      switchMap((action: fromValidateRegistrationActions.ValidateToken) =>
        this.accountApiService.validateSelfRegistrationToken(action.payload.token).pipe(
          map(() => new fromValidateRegistrationActions.ValidateTokenSuccess({ token: action.payload.token })),
          catchError<any, fromValidateRegistrationActions.Actions>((errorResponse: HttpErrorResponse) => {
            const errorMessage: string = errorResponse.error.message;
            if (errorResponse.status === 400 && errorMessage === 'token_expired') {
              return of(new fromValidateRegistrationActions.ValidateTokenExpired());
            } else if (errorResponse.status === 400 && errorMessage === 'user_exists') {
              return of(new fromValidateRegistrationActions.ValidateTokenAccountExists({ accountEmail: errorResponse.error.email }));
            } else if (errorResponse.status === 400 && errorMessage === 'company_exists') {
              return of(new fromValidateRegistrationActions.ValidateTokenCompanyExists(
                { type: errorResponse.error.type, name: errorResponse.error.name }
              ));
            } else {
              return of(new fromValidateRegistrationActions.ValidateTokenError());
            }
          })
        )
      )
    );

  @Effect()
  resendToken$: Observable<Action> = this.actions$
    .ofType(fromValidateRegistrationActions.RESEND_TOKEN).pipe(
      switchMap((action: fromValidateRegistrationActions.ResendToken) => {
        return this.accountApiService.resendSelfRegistrationToken(action.payload.token).pipe(
          map((response) => new fromValidateRegistrationActions.ResendTokenSuccess({ email: response.email })),
          catchError(() => of(new fromValidateRegistrationActions.ResendTokenError()))
        );
      }),
    );

  constructor(
    private actions$: Actions,
    private accountApiService: AccountApiService  ) {}
}
