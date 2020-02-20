import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';

import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';

import * as fromJobDescriptionWorkflowCompareActions from '../actions/job-description-workflow-compare.actions';

@Injectable()
export class JobDescriptionWorkflowCompareEffects {

  @Effect()
  loadJobDescriptionComparison$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionWorkflowCompareActions.LOADING_JOB_DESCRIPTION_COMPARISON),
      switchMap((action: fromJobDescriptionWorkflowCompareActions.LoadingJobDescriptionComparison) =>
        this.jobDescriptionApiService.getWorkflowCompare(
          action.payload.jobDescriptionId,
          action.payload.sourceStepNumber,
          action.payload.comparisonStepNumber).pipe(
          map((response) => {
            return new fromJobDescriptionWorkflowCompareActions.LoadJobDescriptionComparisonSuccess(response);
          }),
          catchError(response => of(new fromJobDescriptionWorkflowCompareActions.LoadJobDescriptionComparisonError()))
        )
      ));

  @Effect()
  loadJobDescriptionCompareList$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionWorkflowCompareActions.LOAD_COMPARE_LIST),
      switchMap((action: fromJobDescriptionWorkflowCompareActions.LoadCompareList) =>
        this.jobDescriptionApiService.getWorkflowCompareList(action.payload).pipe(
          map((response) => {
            return new fromJobDescriptionWorkflowCompareActions.LoadCompareListSuccess(response);
          }),
          catchError(response => of(new fromJobDescriptionWorkflowCompareActions.LoadCompareListError()))
        )
      ));

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService
  ) {}
}
