import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap, debounceTime, withLatestFrom } from 'rxjs/operators';

import { AccountApiService } from 'libs/data/payfactors-api/auth/account-api.service';

import * as fromRegistrationFormActions from '../actions/registration-form.actions';
import * as fromRegistrationReducer from '../reducers';

@Injectable()
export class RegistrationFormEffects {
  @Effect()
  submitRequestForm$: Observable<Action> = this.actions$
    .ofType(fromRegistrationFormActions.SUBMIT).pipe(
      // in case of an error the form can be re-submitted rapidly by holding enter, so debounce that
      debounceTime(400),
      // get the form data from the store so it can be passed along in the post body
      withLatestFrom(
        this.store.select(fromRegistrationReducer.getRegistrationForm),
        (action: fromRegistrationFormActions.Submit, form) => ({ action, form })),
      switchMap((selfRegistration) => {
        const form: any = Object.assign({}, selfRegistration.form);
        delete form.TermsAndConditions;
        return this.accountApiService.submitSelfRegistrationRequest(form).pipe(
          map(() => new fromRegistrationFormActions.SubmitSuccess()),
          catchError(error => of(new fromRegistrationFormActions.SubmitError(error)))
        );
      }),
    );

  constructor(
    private actions$: Actions,
    private accountApiService: AccountApiService,
    private store: Store<fromRegistrationReducer.State>
  ) {}
}
