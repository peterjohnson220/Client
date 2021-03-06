import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
import { catchError, map, switchMap, mergeMap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { CompanyJobApiService, JobsApiService } from 'libs/data/payfactors-api';

import * as fromJobDescriptionActions from '../actions';
import * as fromJobDescriptionReducer from '../reducers';

import { CompanyJob } from 'libs/models';


@Injectable()
export class JobDescriptionEffects {

  constructor(
    private actions$: Actions,
    private companyJobApiService: CompanyJobApiService,
    private jobsApiService: JobsApiService,
    private store: Store<fromJobDescriptionReducer.State>
  ) { }

  @Effect()
  loadJobDescription$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobDescriptionActions.LOAD_JOB_DESCRIPTION),
    switchMap((data: any) => {
      return this.companyJobApiService.getJobSummary(data.payload).pipe(
        map((result: any) => new fromJobDescriptionActions.LoadJobDescriptionSuccess(result)),
        catchError(error => of(new fromJobDescriptionActions.LoadJobDescriptionError()))
      );
    })
  );

  @Effect()
  saveJobDescription$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobDescriptionActions.SAVE_JOB_DESCRIPTION),
    mergeMap((saveJobDescriptionAction: fromJobDescriptionActions.SaveJobDescription) =>
        of(saveJobDescriptionAction).pipe(
          withLatestFrom(
            this.store.pipe(select(fromJobDescriptionReducer.getJobId)),
            this.store.pipe(select(fromJobDescriptionReducer.getUpdatedJobDescription)),
            (action: fromJobDescriptionActions.SaveJobDescription, jobId, updatedJobDescription) =>
              ({ action, jobId, updatedJobDescription })
          )
        ),
      ),
    switchMap((data: any) => {
      const job = { CompanyJobId: data.jobId, JobDescription: data.updatedJobDescription } as CompanyJob;
      return this.companyJobApiService.patchCompanyJob(job).pipe(
        map(() => new fromJobDescriptionActions.SaveJobDescriptionSuccess(job.JobDescription)),
        catchError(error => of(new fromJobDescriptionActions.SaveJobDescriptionError()))
      );
    })
  );

  @Effect()
  exportJobDescription$ = this.actions$.pipe(
    ofType(fromJobDescriptionActions.EXPORT_JOB_DESCRIPTION),
    switchMap((action: fromJobDescriptionActions.ExportJobDescription) => {
      return this.jobsApiService.exportJobDescription(action.payload).pipe(
        map((response) => new fromJobDescriptionActions.ExportJobDescriptionSuccess()),
        catchError(() => of(new fromJobDescriptionActions.ExportJobDescriptionError()))
      );
    })
  );

}

