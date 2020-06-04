import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { ExchangeSignupFormApiService } from 'libs/data/payfactors-api/form';
import { HospitalitySignupForm } from 'libs/models/form';

import * as fromSharedActions from '../../../shared/actions/shared.actions';
import * as fromSharedReducer from '../../../shared/reducers';

@Injectable()
export class HospitalitySignupEffects {

  @Effect()
  submitForm$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromSharedActions.SubmitForm>(fromSharedActions.SUBMIT_FORM),
      withLatestFrom(this.store.pipe(select(fromSharedReducer.getRootFormModelValue)),
        (action, signupForm: HospitalitySignupForm) => {
          return { action, signupForm };
        }
      ),
      switchMap((data) => {
        return this.exchangeSignupFormApiService.submitHospitalitySignup(data.signupForm).pipe(
          map(formSubmissionResponse => {
            return new fromSharedActions.SubmitFormSuccess({ formSubmissionResponse });
          }),
          catchError(() => of(new fromSharedActions.SubmitFormError()))
        );
      })
    );

  constructor(
    private actions$: Actions,
    private exchangeSignupFormApiService: ExchangeSignupFormApiService,
    private store: Store<fromSharedReducer.State>
  ) {
  }
}
