import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionApiService, JobDescriptionTemplateApiService } from 'libs/data/payfactors-api/jdm';

import * as fromJobDescriptionActions from '../actions/job-description.actions';
import * as fromJobDescriptionReducer from '../reducers';

@Injectable()
export class JobDescriptionEffects {
  @Effect()
  createJobDescription$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionActions.CREATE_JOB_DESCRIPTION),
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
    .pipe(
      ofType(fromJobDescriptionActions.CREATE_JOB_DESCRIPTION_DRAFT),
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
    .pipe(
      ofType(fromJobDescriptionActions.SAVE_COMPANY_JOBS_JOB_DESCRIPTION_TEMPLATE_ID),
      switchMap((action: fromJobDescriptionActions.SaveCompanyJobsJobDescriptionTemplateId) => {
        const templateId = action.payload.PassThroughParameters.templateId;

        return this.jobDescriptionTemplateApiService.saveCompanyJobsJobDescriptionTemplateId(templateId, action.payload.Request)
          .pipe(
            map((response: any) => {
              const successPayload = {
                Response: response,
                PassThroughParameters: action.payload.PassThroughParameters
              };

              return new fromJobDescriptionActions.SaveCompanyJobsJobDescriptionTemplateIdSuccess(successPayload);
            }),
            catchError(response => of(new fromJobDescriptionActions.SaveCompanyJobsJobDescriptionTemplateIdError()))
          );
      }));

  @Effect()
  getJobDescription$ = this.actions$
    .pipe(
      ofType(fromJobDescriptionActions.GET_JOB_DESCRIPTION),
      switchMap((action: fromJobDescriptionActions.GetJobDescription) => {
        return this.jobDescriptionApiService.getDetail(action.payload.jobDescriptionId)
          .pipe(
            map((response) => new fromJobDescriptionActions.GetJobDescriptionSuccess(response)),
            catchError(() => of(new fromJobDescriptionActions.GetJobDescriptionError()))
          );
      })
    );

  @Effect()
  saveJobDescription$ = this.actions$
    .pipe(
      ofType(fromJobDescriptionActions.SAVE_JOB_DESCRIPTION),
      switchMap((action: fromJobDescriptionActions.SaveJobDescription) => {
        return this.jobDescriptionApiService.save(action.payload.jobDescription, action.payload.isFirstSave)
          .pipe(
            map((response) => new fromJobDescriptionActions.SaveJobDescriptionSuccess({
              jobDescription: response,
              isFirstSave: action.payload.isFirstSave,
              undo: action.payload.undo
            })),
            catchError(() => of(new fromJobDescriptionActions.SaveJobDescriptionError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService,
    private jobDescriptionTemplateApiService: JobDescriptionTemplateApiService,
    private store: Store<fromJobDescriptionReducer.State>,
  ) {}
}
