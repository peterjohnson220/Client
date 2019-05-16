import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';
import { JobDescriptionTemplateApiService } from 'libs/data/payfactors-api/jdm/job-description-template-api.service';

import * as fromJobDescriptionActions from '../actions/job-description.actions';
import * as fromJobDescriptionReducer from '../reducers';

@Injectable()
export class JobDescriptionEffects {
  @Effect()
  createJobDescription$: Observable<Action> = this.actions$
    .ofType(fromJobDescriptionActions.CREATE_JOB_DESCRIPTION).pipe(
      switchMap((action: fromJobDescriptionActions.CreateJobDescription) =>
        this.jobDescriptionApiService.createJobDescription(action.payload).pipe(
          map((response: number) => {
            return new fromJobDescriptionActions.CreateJobDescriptionSuccess(response);
          }),
          catchError(response => of(new fromJobDescriptionActions.CreateJobDescriptionError()))
        )
      ));

  @Effect()
  createJobDescriptionDraft$: Observable<Action> = this.actions$
    .ofType(fromJobDescriptionActions.CREATE_JOB_DESCRIPTION_DRAFT).pipe(
      switchMap((action: fromJobDescriptionActions.CreateJobDescriptionDraft) =>
        this.jobDescriptionApiService.createJobDescriptionDraft(action.payload.JobDescriptionId, action.payload.Request).pipe(
          map((response: string) => {
            return new fromJobDescriptionActions.CreateJobDescriptionDraftSuccess(response);
          }),
          catchError(response => of(new fromJobDescriptionActions.CreateJobDescriptionDraftError()))
        )
      ));

  @Effect()
  saveCompanyJobsJobDescriptionTemplateId$: Observable<Action> = this.actions$
    .ofType(fromJobDescriptionActions.SAVE_COMPANY_JOBS_JOB_DESCRIPTION_TEMPLATE_ID).pipe(
      switchMap((action: fromJobDescriptionActions.SaveCompanyJobsJobDescriptionTemplateId) =>
        this.jobDescriptionTemplateApiService.saveCompanyJobsJobDescriptionTemplateId(action.payload.Request)
          .pipe(
            map((response: any) => {
              const successPayload = {
                Response: response,
                PassThroughParameters: action.payload.PassThroughParameters
              };

              return new fromJobDescriptionActions.SaveCompanyJobsJobDescriptionTemplateIdSuccess(successPayload);
            }),
            catchError(response => of(new fromJobDescriptionActions.SaveCompanyJobsJobDescriptionTemplateIdError()))
        )
      ));

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService,
    private jobDescriptionTemplateApiService: JobDescriptionTemplateApiService,
    private store: Store<fromJobDescriptionReducer.State>,
  ) {}
}
