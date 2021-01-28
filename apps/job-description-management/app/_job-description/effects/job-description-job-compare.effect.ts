import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';
import { JobDescription } from 'libs/models/jdm';

import * as fromJobDescriptionJobCompareActions from '../actions/job-description-job-compare.actions';
import { JobDescriptionManagementService } from 'libs/features/jobs/job-description-management';

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

  @Effect()
  loadJobDescriptionComparisonDiff$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionJobCompareActions.LOAD_JOB_DESCRIPTION_COMPARISON_DIFF),
      switchMap((action: fromJobDescriptionJobCompareActions.LoadJobDescriptionComparisonDiff) =>
        this.jobDescriptionApiService.getJobCompare(action.sourceJobDescriptionId, action.compareJobDescriptionId).pipe(
          map((response: any) => {
            return new fromJobDescriptionJobCompareActions.LoadJobDescriptionComparisonDiffSuccess(response);
          }),
          catchError(response => of(new fromJobDescriptionJobCompareActions.LoadJobDescriptionComparisonDiffError()))
        )
      )
    );

  @Effect()
  saveJobDescription$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionJobCompareActions.SAVE_JOB_DESCRIPTION),
      switchMap((action: fromJobDescriptionJobCompareActions.SaveJobDescription) =>
        this.jobDescriptionApiService.save(action.payload.JobDescription, action.payload.IsFirstSave).pipe(
          mergeMap((response: JobDescription) => {
            const actions = [];
            actions.push(new fromJobDescriptionJobCompareActions.SaveJobDescriptionSuccess(response, action.payload.IsFirstSave));
            actions.push(new fromJobDescriptionJobCompareActions.LoadJobDescriptionComparisonDiff(
              action.payload.JobDescription.JobDescriptionId,
              action.payload.CompareJobDescriptionId));
            return actions;
          }),
          catchError(error => of(
            new fromJobDescriptionJobCompareActions.SaveJobDescriptionError(
              this.jobDescriptionManagementService.buildErrorModel(error, 'job description', 'job-description-management/job-descriptions'))))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService,
    private jobDescriptionManagementService: JobDescriptionManagementService) {
  }
}
