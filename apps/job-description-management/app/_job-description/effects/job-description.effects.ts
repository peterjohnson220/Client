import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { JobDescription } from 'libs/models/jdm';

import * as fromRootState from 'libs/state/state';
import { JobDescriptionApiService, JobDescriptionTemplateApiService, JobDescriptionManagementApiService } from 'libs/data/payfactors-api/jdm';
import { ExtendedInfoResponse } from 'libs/models/payfactors-api/job-description/response';
import { CompanyDto } from 'libs/models/company';
import { CompanyApiService } from 'libs/data/payfactors-api/company';

import * as fromJobDescriptionActions from '../actions/job-description.actions';
import * as fromCopyJobDescriptionActions from '../actions/copy-job-description-modal.actions';
import { PayfactorsApiModelMapper } from '../../shared/helpers';
import { GetJobDescriptionData } from '../models';

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
      withLatestFrom(
        this.userContextStore.select(fromRootState.getUserContext),
        (action: fromJobDescriptionActions.GetJobDescription, userContext) => ({ action, userContext })
      ),
      switchMap((data) => {
        return this.jobDescriptionApiService.getDetail(
          data.action.payload.JobDescriptionId,
          data.action.payload.RevisionNumber,
          data.action.payload.ViewName)
          .pipe(
            mergeMap((response: JobDescription) => {
              const actions = [];
              actions.push( new fromJobDescriptionActions.GetJobDescriptionSuccess({
                jobDescription: response,
                requestData: data.action.payload
              }));
              actions.push(new fromJobDescriptionActions.GetJobDescriptionExtendedInfo({
                jobDescriptionId: response.JobDescriptionId,
                revision: response.JobDescriptionRevision
              }));
              if (!data.action.payload.InWorkflow && !data.userContext.IsPublic && !data.action.payload.ViewName) {
                actions.push(new fromJobDescriptionActions.GetViews({ templateId: response.TemplateId }));
              }
              return actions;
            }),
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

  @Effect()
  loadCompanyLogo$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionActions.LOAD_COMPANY_LOGO),
      switchMap((action: fromJobDescriptionActions.LoadCompanyLogo) => {
        return this.companyApiService.get(action.payload).pipe(
          map((response: CompanyDto) => {
            return new fromJobDescriptionActions.LoadCompanyLogoSuccess(response.CompanyLogo);
          }),
          catchError(response => of(new fromJobDescriptionActions.LoadCompanyLogoError()))
        );
      })
    );

  @Effect()
  publishJobDescription$ = this.actions$
    .pipe(
      ofType(fromJobDescriptionActions.PUBLISH_JOB_DESCRIPTION),
      switchMap((action: fromJobDescriptionActions.PublishJobDescription) => {
        return this.jobDescriptionApiService.publish(action.payload.jobDescriptionId)
          .pipe(
            map((response) => new fromJobDescriptionActions.PublishJobDescriptionSuccess(response)),
            catchError(() => of(new fromJobDescriptionActions.PublishJobDescriptionError()))
          );
      })
    );

  @Effect()
  getViews$ = this.actions$
    .pipe(
      ofType(fromJobDescriptionActions.GET_VIEWS),
      switchMap((action: fromJobDescriptionActions.GetViews) => {
        return this.jobDescriptionManagementApiService.getViewNames(action.payload.templateId)
          .pipe(
            map((response: string[]) => new fromJobDescriptionActions.GetViewsSuccess({ views: response })),
            catchError(() => of(new fromJobDescriptionActions.GetViewsError()))
          );
      })
    );

  @Effect()
  discardDraft$ = this.actions$
    .pipe(
      ofType(fromJobDescriptionActions.DISCARD_DRAFT),
      switchMap((action: fromJobDescriptionActions.DiscardDraft) => {
        return this.jobDescriptionApiService.discardDraft(action.payload.jobDescriptionId)
          .pipe(
            map((response) => {
              if (response === '') {
                return new fromJobDescriptionActions.DiscardDraftSuccess();
              }
              const jobDescription: JobDescription = JSON.parse(response);
              const requestData: GetJobDescriptionData = {
                JobDescriptionId: action.payload.jobDescriptionId,
                InWorkflow: action.payload.inWorkflow
              };
              return new fromJobDescriptionActions.GetJobDescriptionSuccess({
                jobDescription,
                requestData
              });
            }),
            catchError(() => of(new fromJobDescriptionActions.DiscardDraftError()))
          );
      })
    );

  @Effect({dispatch: false})
  discardDraftSuccess$ = this.actions$
    .pipe(
      ofType(fromJobDescriptionActions.DISCARD_DRAFT_SUCCESS),
      tap(() => this.router.navigate(['']))
    );

  @Effect()
  getJobDescriptionExtendedInfo$ = this.actions$
    .pipe(
      ofType(fromJobDescriptionActions.GET_JOB_DESCRIPTION_EXTENDED_INFO),
      switchMap((action: fromJobDescriptionActions.GetJobDescriptionExtendedInfo) => {
        return this.jobDescriptionApiService.getJobDescriptionExtendedInfo(action.payload.jobDescriptionId, action.payload.revision).pipe(
            map((response: ExtendedInfoResponse) => {
              const extendedInfo = PayfactorsApiModelMapper.mapJDExtendedInfoResponseToJDExtendedInfoItem(response);
              return new fromJobDescriptionActions.LoadJobDescriptionExtendedInfo(extendedInfo);
              },
            catchError(() => of(new fromJobDescriptionActions.GetJobDescriptionExtendedInfoError()))
          ));
      })
    );

  @Effect()
  replaceJobDescriptionViaCopySuccess$ = this.actions$
    .pipe(
      ofType(fromCopyJobDescriptionActions.REPLACE_JOB_DESCRIPTION_SUCCESS),
      map((action: fromCopyJobDescriptionActions.ReplaceJobDescriptionSuccess) => {
        return new fromJobDescriptionActions.ReplaceJobDescriptionViaCopy(action.payload);
      })
    );

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService,
    private companyApiService: CompanyApiService,
    private jobDescriptionTemplateApiService: JobDescriptionTemplateApiService,
    private jobDescriptionManagementApiService: JobDescriptionManagementApiService,
    private router: Router,
    private userContextStore: Store<fromRootState.State>,
  ) {}
}
