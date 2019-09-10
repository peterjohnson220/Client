import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';
import { JobDescription } from 'libs/models/jdm';

import * as fromJobDescriptionJobCompareActions from '../actions/job-description-job-compare.actions';
import * as fromJobDescriptionReducer from '../reducers';


@Injectable()
export class JobDescriptionJobCompareEffects {
  @Effect()
  loadSourceJobDescription$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionJobCompareActions.LOAD_SOURCE_JOB_DESCRIPTION),
      switchMap((action: fromJobDescriptionJobCompareActions.LoadSourceJobDescription) =>
        this.jobDescriptionApiService.getDetail(action.payload).pipe(
          map((response: JobDescription) => {
            return new fromJobDescriptionJobCompareActions.LoadSourceJobDescriptionSuccess(response);
          }),
          catchError(response => of(new fromJobDescriptionJobCompareActions.LoadSourceJobDescriptionError()))
        )
      )
    );

  @Effect()
  loadJobDescriptionForComparison$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionJobCompareActions.LOAD_JOB_DESCRIPTION_FOR_COMPARISON),
      switchMap((action: fromJobDescriptionJobCompareActions.LoadJobDescriptionForComparison) =>
        this.jobDescriptionApiService.getDetail(action.payload).pipe(
          map((response: JobDescription) => {
            return new fromJobDescriptionJobCompareActions.LoadJobDescriptionForComparisonSuccess(response);
          }),
          catchError(response => of(new fromJobDescriptionJobCompareActions.LoadJobDescriptionForComparisonError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService,
    private store: Store<fromJobDescriptionReducer.State>,
  ) {}
}
