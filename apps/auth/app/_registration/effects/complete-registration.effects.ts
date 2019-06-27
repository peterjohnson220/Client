import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AccountApiService } from 'libs/data/payfactors-api/auth/account-api.service';

import * as fromCompleteRegistrationActions from '../actions/complete-registration.actions';

@Injectable()
export class CompleteRegistrationEffects {
  @Effect()
  submitCompletionForm$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCompleteRegistrationActions.SUBMIT),
      switchMap((action: fromCompleteRegistrationActions.Submit) => {
        return this.accountApiService.submitSelfRegistrationCompletion(action.payload.token, action.payload.password).pipe(
          map((homePagePath) => new fromCompleteRegistrationActions.SubmitSuccess(homePagePath)),
          catchError(error => of(new fromCompleteRegistrationActions.SubmitError(error)))
        );
      }),
    );

  @Effect({ dispatch: false })
  completionSubmitSuccess$ = this.actions$
    .pipe(
      ofType(fromCompleteRegistrationActions.SUBMIT_SUCCESS),
      map((action: fromCompleteRegistrationActions.SubmitSuccess) => {
        document.location.href = document.location.origin + action.payload.homePagePath;
      })
    );

  constructor(
    private actions$: Actions,
    private accountApiService: AccountApiService) {}
}
