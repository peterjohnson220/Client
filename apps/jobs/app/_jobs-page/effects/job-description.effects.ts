import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { CompanyJobApiService } from 'libs/data/payfactors-api';

import * as fromJobDescriptionActions from '../actions';
import { CompanyJob } from 'libs/models';


@Injectable()
export class JobDescriptionEffects {

  constructor(
    private actions$: Actions,
    private companyJobApiService: CompanyJobApiService,
  ) { }

  @Effect()
  loadJobDescription$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobDescriptionActions.LOAD_JOB_DESCRIPTION),
    switchMap((data: any) => {
      return this.companyJobApiService.getJobSummary(data.payload).pipe(
        map((result: any) => new fromJobDescriptionActions.LoadJobDescriptionSuccess(result)),
        catchError(error => {
          const msg = 'We encountered an error while loading your company data';
          return of(new fromJobDescriptionActions.HandleApiError(msg));
        })
      );
    })
  );

  @Effect()
  saveJobDescription$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobDescriptionActions.SAVE_JOB_DESCRIPTION),
    switchMap((data: any) => {
      const job = { CompanyJobId: data.payload.jobId, JobDescription: data.payload.jobDescription } as CompanyJob;
      return this.companyJobApiService.patchCompanyJob(job).pipe(
        map(() => new fromJobDescriptionActions.SaveJobDescriptionSuccess()),
        catchError(error => {
          const msg = 'We encountered an error while creating a project';
          return of(new fromJobDescriptionActions.HandleApiError(msg));
        })
      );
    })
  );


}

