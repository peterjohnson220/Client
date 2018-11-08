import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom, debounceTime } from 'rxjs/operators';

import * as fromSelfRegistrationActions from '../actions/self-registration.action';
import * as fromLoginReducer from '../reducers';
import { AccountApiService } from 'libs/data/payfactors-api/auth';

@Injectable()
export class SelfRegistrationEffects {
  constructor(
    private actions$: Actions,
    private accountApiService: AccountApiService,
    private store: Store<fromLoginReducer.State>) { }

  @Effect()
  submitForm$: Observable<Action> = this.actions$
    .ofType(fromSelfRegistrationActions.SUBMIT).pipe(
      // in case of an error the form can be re-submitted rapidly by holding enter, so debounce that
      debounceTime(400),
      // get the form data from the store so it can be passed along in the post body
      withLatestFrom(
        this.store.select(fromLoginReducer.getSelfRegistrationForm),
        (action: fromSelfRegistrationActions.FieldChange, form) => ({ action, form })),
      switchMap((selfRegistration) => {
        return this.accountApiService.submitSelfRegistration(selfRegistration.form).pipe(
          map(() => new fromSelfRegistrationActions.SubmitSuccess()),
          catchError(error => of(new fromSelfRegistrationActions.SubmitError(error)))
        );
      }),
    );
}
