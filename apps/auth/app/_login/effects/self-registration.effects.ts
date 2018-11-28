import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap, debounceTime, withLatestFrom } from 'rxjs/operators';

import { AccountApiService } from 'libs/data/payfactors-api/auth/account-api.service';

import * as fromSelfRegistrationActions from '../actions/self-registration.actions';
import * as fromLoginReducer from '../reducers';

@Injectable()
export class SelfRegistrationEffects {
  @Effect()
  validateRegistrationToken$: Observable<Action> = this.actions$
    .ofType(fromSelfRegistrationActions.VALIDATE_TOKEN).pipe(
      switchMap((action: fromSelfRegistrationActions.ValidateToken) =>
        this.accountApiService.validateSelfRegistrationToken(action.payload.token).pipe(
          map(() => new fromSelfRegistrationActions.ValidateTokenSuccess({ token: action.payload.token })),
          catchError<any, fromSelfRegistrationActions.Actions>((errorResponse: HttpErrorResponse) => {
            const errorMessage: string = errorResponse.error.message;
            if (errorResponse.status === 400 && errorMessage === 'token_expired') {
              return of(new fromSelfRegistrationActions.ValidateTokenExpired());
            } else if (errorResponse.status === 400 && errorMessage === 'user_exists') {
              return of(new fromSelfRegistrationActions.ValidateTokenAccountExists({ accountEmail: errorResponse.error.email }));
            } else if (errorResponse.status === 400 && errorMessage === 'company_exists') {
              return of(new fromSelfRegistrationActions.ValidateTokenCompanyExists(
                { type: errorResponse.error.type, name: errorResponse.error.name }
              ));
            } else {
              return of(new fromSelfRegistrationActions.ValidateTokenError());
            }
          })
        )
      )
    );

  @Effect()
  submitRequestForm$: Observable<Action> = this.actions$
    .ofType(fromSelfRegistrationActions.REQUEST_SUBMIT).pipe(
      // in case of an error the form can be re-submitted rapidly by holding enter, so debounce that
      debounceTime(400),
      // get the form data from the store so it can be passed along in the post body
      withLatestFrom(
        this.store.select(fromLoginReducer.getSelfRegistrationForm),
        (action: fromSelfRegistrationActions.RequestSubmit, form) => ({ action, form })),
      switchMap((selfRegistration) => {
        const form: any = Object.assign({}, selfRegistration.form);
        delete form.TermsAndConditions;
        return this.accountApiService.submitSelfRegistrationRequest(form).pipe(
          map(() => new fromSelfRegistrationActions.RequestSubmitSuccess()),
          catchError(error => of(new fromSelfRegistrationActions.RequestSubmitError(error)))
        );
      }),
    );

  @Effect()
  submitCompletionForm$: Observable<Action> = this.actions$
    .ofType(fromSelfRegistrationActions.COMPLETION_SUBMIT).pipe(
      switchMap((action: fromSelfRegistrationActions.CompletionSubmit) => {
        return this.accountApiService.submitSelfRegistrationCompletion(action.payload.Token, action.payload.Password).pipe(
          map(() => new fromSelfRegistrationActions.CompletionSubmitSuccess()),
          catchError(error => of(new fromSelfRegistrationActions.CompletionSubmitError(error)))
        );
      }),
    );

  constructor(
    private actions$: Actions,
    private accountApiService: AccountApiService,
    private store: Store<fromLoginReducer.State>
  ) {}
}
