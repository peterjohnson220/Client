import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, mergeMap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';
import { JobDescription } from 'libs/models/jdm';
import * as fromJobDescriptionManagementSharedReducer from 'libs/features/jobs/job-description-management/reducers';

import * as fromJobDescriptionJobCompareActions from '../actions/job-description-job-compare.actions';
import { JobDescriptionManagementService } from 'libs/features/jobs/job-description-management';

@Injectable()
export class JobDescriptionJobCompareEffects {
  @Effect()
  loadJobDescriptionList$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionJobCompareActions.LOAD_JOB_DESCRIPTION_LIST),
      switchMap((action: fromJobDescriptionJobCompareActions.LoadJobDescriptionList) => {
        return this.jobDescriptionApiService.getJobDescriptionJobCompareList(action.payload).pipe(
          map((response) => new fromJobDescriptionJobCompareActions.LoadJobDescriptionListSuccess(response)),
          catchError(() => of(new fromJobDescriptionJobCompareActions.LoadJobDescriptionListError()))
        );
      })
    );

  @Effect()
  loadSourceJobDescription$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionJobCompareActions.LOAD_SOURCE_JOB_DESCRIPTION),
      withLatestFrom(
        this.jdmSharedStore.select(fromJobDescriptionManagementSharedReducer.getControlTypes),
        (action: fromJobDescriptionJobCompareActions.LoadSourceJobDescription, controlTypes) => ({ action, controlTypes })
      ),
      switchMap((data) =>
        this.jobDescriptionApiService.getDetail(data.action.payload).pipe(
          map((response) => {
            return new fromJobDescriptionJobCompareActions.LoadSourceJobDescriptionSuccess({
              jobDescription: response,
              controlTypes: data.controlTypes
            });
          }),
          catchError(response => of(new fromJobDescriptionJobCompareActions.LoadSourceJobDescriptionError()))
        )
      )
    );

  @Effect()
  loadJobDescriptionForComparison$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionJobCompareActions.LOAD_JOB_DESCRIPTION_FOR_COMPARISON),
      withLatestFrom(
        this.jdmSharedStore.select(fromJobDescriptionManagementSharedReducer.getControlTypes),
        (action: fromJobDescriptionJobCompareActions.LoadJobDescriptionForComparison, controlTypes) => ({ action, controlTypes })
      ),
      switchMap((data) =>
        this.jobDescriptionApiService.getDetail(data.action.payload).pipe(
          map((response: JobDescription) => {
            return new fromJobDescriptionJobCompareActions.LoadJobDescriptionForComparisonSuccess({
              jobDescription: response,
              controlTypes: data.controlTypes
            });
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
      switchMap((action: fromJobDescriptionJobCompareActions.SaveJobDescription) => {
        return this.jobDescriptionApiService.save(action.payload.JobDescription, action.payload.IsFirstSave).pipe(
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
        );
      })
    );

  constructor(
    private actions$: Actions,
    private jdmSharedStore: Store<fromJobDescriptionManagementSharedReducer.State>,
    private jobDescriptionApiService: JobDescriptionApiService,
    private jobDescriptionManagementService: JobDescriptionManagementService) {
  }
}
