import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, tap, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { JobDescriptionApiService, JobDescriptionTemplateApiService } from 'libs/data/payfactors-api/jdm';

import * as fromJobDescriptionListActions from '../actions/job-description-list.actions';
import { JobDescriptionListHelper } from '../helpers';
import { SaveJobDescriptionTemplateIdSucessModel } from '../models';
import { MessageHelper } from '../../shared';

@Injectable()
export class JobDescriptionListEffects {

  @Effect()
  createJobDescription$ = this.actions$
    .pipe(
      ofType(fromJobDescriptionListActions.CREATE_JOB_DESCRIPTION),
      switchMap((action: fromJobDescriptionListActions.CreateJobDescription) => {
        const request = JobDescriptionListHelper.buildCreateJobDescriptionRequest(
          action.payload.companyJobViewListItem,
          action.payload.appliesTo
        );
        return this.jobDescriptionApiService.createJobDescription(request)
          .pipe(
            map((response) => new fromJobDescriptionListActions.CreateJobDescriptionSuccess({ jobDescriptionId: response })),
            catchError(() => of(new fromJobDescriptionListActions.CreateJobDescriptionError()))
          );
      })
    );

  @Effect({ dispatch: false })
  createJobDescriptionSuccess$ = this.actions$
    .pipe(
      ofType(fromJobDescriptionListActions.CREATE_JOB_DESCRIPTION_SUCCESS),
      tap((action: fromJobDescriptionListActions.CreateJobDescriptionSuccess) =>
        this.router.navigate([`job-descriptions/${action.payload.jobDescriptionId}`])
      )
    );

  @Effect()
  createJobDescriptionDraft$ = this.actions$
    .pipe(
      ofType(fromJobDescriptionListActions.CREATE_JOB_DESCRIPTION_DRAFT),
      switchMap((action: fromJobDescriptionListActions.CreateJobDescriptionDraft) => {
        const request = JobDescriptionListHelper.buildCreateJobDescriptionDraftRequest(action.payload);
        return this.jobDescriptionApiService.createJobDescriptionDraft(action.payload.JobDescriptionId, request).pipe(
          map((response) => {
            const draftDetails = JobDescriptionListHelper.mapCreateJobDescriptionResponseToJobDescriptionDraftDetails(response);
            return new fromJobDescriptionListActions.CreateJobDescriptionDraftSuccess(draftDetails);
          }),
          catchError(() => of(new fromJobDescriptionListActions.CreateJobDescriptionDraftError()))
        );
      })
    );

  @Effect({dispatch: false})
  createJobDescriptionDraftSuccess$ = this.actions$
    .pipe(
      ofType(fromJobDescriptionListActions.CREATE_JOB_DESCRIPTION_DRAFT_SUCCESS),
      tap((action: fromJobDescriptionListActions.CreateJobDescriptionDraftSuccess) =>
        this.router.navigate([`job-descriptions/${action.payload.JobDescriptionId}`])
      )
    );

  @Effect()
  saveCompanyJobsJobDescriptionTemplateId$ = this.actions$
    .pipe(
      ofType(fromJobDescriptionListActions.SAVE_COMPANY_JOBS_JOB_DESCRIPTION_TEMPLATE_ID),
      switchMap((action: fromJobDescriptionListActions.SaveCompanyJobsJobDescriptionTemplateId) => {
        const request = JobDescriptionListHelper.buildSaveCompanyJobsJobDescriptionTemplateIdRequest(action.payload.companyJobIdsToAssign, []);

        return this.jobDescriptionTemplateApiService.saveCompanyJobsJobDescriptionTemplateId(action.payload.passThroughParameters.templateId, request)
          .pipe(
            map((response: any) => {
              const successPayload: SaveJobDescriptionTemplateIdSucessModel = {
                Response: response,
                PassThroughParameters: action.payload.passThroughParameters
              };

              return new fromJobDescriptionListActions.SaveCompanyJobsJobDescriptionTemplateIdSuccess(successPayload);
            }),
            catchError(response => {
              if (response.status === 409) {
                return of(new fromJobDescriptionListActions.
                  SaveCompanyJobsJobDescriptionTemplateIdError(
                    {errorMessage: 'Job already assigned to template please refresh page'})
                  );
              } else {
                return of(new fromJobDescriptionListActions.
                  SaveCompanyJobsJobDescriptionTemplateIdError(
                    {errorMessage: MessageHelper.buildErrorMessage('There was an error saving this job information.')}
                  ));
              }
            })
          );
      }));

  @Effect()
  saveCompanyJobsJobDescriptionTemplateIdSuccess$ = this.actions$
    .pipe(
      ofType(fromJobDescriptionListActions.SAVE_COMPANY_JOBS_JOB_DESCRIPTION_TEMPLATE_ID_SUCCESS),
      mergeMap((action: fromJobDescriptionListActions.SaveCompanyJobsJobDescriptionTemplateIdSuccess) => {
        const actions = [];
        if (action.payload.PassThroughParameters.selectedCompanyJob &&
          action.payload.PassThroughParameters.selectedCompanyJob.JobDescriptionStatus === 'Not Started') {
          const companyJobViewListItem = action.payload.PassThroughParameters.selectedCompanyJob;
          actions.push(new fromJobDescriptionListActions.CreateJobDescription({ companyJobViewListItem }));
        } else if (action.payload.PassThroughParameters.jobDescriptionAppliesTo) {
          actions.push(new fromJobDescriptionListActions.CreateJobDescription({
            companyJobViewListItem: action.payload.PassThroughParameters.newJobDescription,
            appliesTo: action.payload.PassThroughParameters.jobDescriptionAppliesTo
          }));
        } else {
          actions.push(new fromJobDescriptionListActions.CreateJobDescriptionDraft(action.payload.PassThroughParameters.selectedCompanyJob));
        }
        return actions;
      })
    );

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService,
    private jobDescriptionTemplateApiService: JobDescriptionTemplateApiService,
    private router: Router
  ) {}
}
