import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, mergeMap, tap, withLatestFrom, concatMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { JobDescription } from 'libs/models/jdm';

import * as fromRootState from 'libs/state/state';
import { JobDescriptionApiService, JobDescriptionManagementApiService, JobDescriptionWorkflowStepUserApiService } from 'libs/data/payfactors-api/jdm';
import { AccountApiService } from 'libs/data/payfactors-api/auth';
import { SsoConfigApiService } from 'libs/data/payfactors-api/sso';
import { ExtendedInfoResponse } from 'libs/models/payfactors-api/job-description/response';
import { CompanyApiService } from 'libs/data/payfactors-api/company';

import * as fromJobDescriptionActions from '../actions/job-description.actions';
import * as fromCopyJobDescriptionActions from '../actions/copy-job-description-modal.actions';
import * as fromWorkflowActions from '../actions/workflow.actions';
import { PayfactorsApiModelMapper } from 'libs/features/job-description-management/helpers';
import { GetJobDescriptionData } from '../models';

@Injectable()
export class JobDescriptionEffects {

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
              if (!data.action.payload.InWorkflow && !data.userContext.IsPublic) {
                actions.push(new fromJobDescriptionActions.GetViews({ templateId: response.TemplateId }));
              }
              return actions;
            }),
            catchError(error => {
              return of(new fromJobDescriptionActions.GetJobDescriptionError(error));
            })
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
            concatMap((response) => {
              if (response === '') {
                this.router.navigate(['']);
              }
              const jobDescription: JobDescription = JSON.parse(response);
              const requestData: GetJobDescriptionData = {
                JobDescriptionId: action.payload.jobDescriptionId,
                InWorkflow: action.payload.inWorkflow
              };
              return [
                new fromJobDescriptionActions.GetJobDescriptionSuccess({
                jobDescription,
                requestData }),
               new fromJobDescriptionActions.DiscardDraftSuccess()
              ];
            }),
            catchError(() => of(new fromJobDescriptionActions.DiscardDraftError()))
          );
      })
    );

  @Effect()
  handleApiError$ = this.actions$
    .pipe(
      ofType(fromJobDescriptionActions.GET_JOB_DESCRIPTION_ERROR),
      mergeMap((action: fromJobDescriptionActions.GetJobDescriptionError) => {
          const actions = [];
          if (action.payload.status === 403) {
            const errorMessage = this.redirectForUnauthorized(action.payload);
            actions.push(new fromWorkflowActions.SetMessage({message: errorMessage}));
          } else if (action.payload.status === 409) {
            this.router.navigate(['/public-token-draft']);
          } else {
            this.router.navigate(['404']);
          }
        return actions;
        })
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

  @Effect()
  deleteJobDescription$ = this.actions$
    .pipe(
      ofType(fromJobDescriptionActions.DELETE_JOB_DESCRIPTION),
      switchMap((action: fromJobDescriptionActions.DeleteJobDescription) => {
        return this.jobDescriptionApiService.deleteJobDescription(action.payload.jobDescriptionId)
          .pipe(
            map(() => new fromJobDescriptionActions.DeleteJobDescriptionSuccess()),
            catchError(() => of(new fromJobDescriptionActions.DeleteJobDescriptionError()))
          );
      })
    );

  @Effect()
  setWorkflowUserStepToIsBeingViewed$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionActions.SET_WORKFLOW_USER_STEP_TO_IS_BEING_VIEWED),
      switchMap((action: fromJobDescriptionActions.SetWorkflowUserStepToIsBeingViewed) => {
        return this.jobDescriptionWorkflowStepUserApiService.setWorkflowUserStepToIsBeingViewed(action.payload.jwt, action.payload.isBeingViewed).pipe(
          map((response) => {
            return new fromJobDescriptionActions.SetWorkflowUserStepToIsBeingViewedSuccess(response);
          }),
          catchError(() => of(new fromJobDescriptionActions.SetWorkflowUserStepToIsBeingViewedError()))
        );
      })
    );

  @Effect()
  authenticateSSOParams$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionActions.AUTHENTICATE_SSO_PARAMS),
      switchMap((action: fromJobDescriptionActions.AuthenticateSSOParams) => {
        return   this.accountApiService.authenticateSSOParams(action.payload.tokenId, action.payload.agentId).pipe(
          map((response) => {
            return new fromJobDescriptionActions.AuthenticateSSOParamsSuccess(response);
          }),
          catchError(error => {
            return of(new fromJobDescriptionActions.AuthenticateSSOParamsError(error));
          })
        );
      })
    );

  @Effect()
  getSSOLoginUrl$ = this.actions$
    .pipe(
      ofType(fromJobDescriptionActions.GET_SSO_LOGIN_URL),
      switchMap((action: fromJobDescriptionActions.GetSSOLoginUrl) => {
        return this.ssoConfigurationService.getSsoLoginUrl().pipe(
          map((response) => {
            return new fromJobDescriptionActions.GetSSOLoginUrlSuccess(response);
          }),
          catchError(() => of(new fromJobDescriptionActions.SetWorkflowUserStepToIsBeingViewedError()))
        );
      })
    );

  private redirectForUnauthorized(error: HttpErrorResponse) {
    if (error.status === 403) {
      return error.error.error.message;
    }
  }

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService,
    private companyApiService: CompanyApiService,
    private jobDescriptionManagementApiService: JobDescriptionManagementApiService,
    private router: Router,
    private userContextStore: Store<fromRootState.State>,
    private jobDescriptionWorkflowStepUserApiService: JobDescriptionWorkflowStepUserApiService,
    private accountApiService: AccountApiService,
    private ssoConfigurationService: SsoConfigApiService
  ) {}
}
