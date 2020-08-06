import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionWorkflowApiService } from 'libs/data/payfactors-api/jdm';
import { JobDescriptionDataResponse } from 'libs/models/payfactors-api/job-description/response';

import * as fromWorkflowActions from '../actions/workflow.actions';
import * as fromJobDescriptionActions from '../actions/job-description.actions';
import { PayfactorsApiModelMapper } from 'libs/features/job-description-management/helpers';

@Injectable()
export class WorkflowEffects {
  @Effect()
  loadWorkflowStepSummary: Observable<Action> = this.actions$
    .pipe(
      ofType(fromWorkflowActions.LOAD_WORKFLOW_STEP_SUMMARY),
      switchMap((action: fromWorkflowActions.LoadWorkflowStepSummary) =>
        this.jobDescriptionWorkflowApiService.getStepSummary(action.payload.workflowId).pipe(
          map((response: string) => {
            return new fromWorkflowActions.LoadWorkflowStepSummarySuccess(response);
          }),
          catchError(response => of(new fromWorkflowActions.LoadWorkflowStepSummaryError()))
        )
      ));

  @Effect()
  getWorkflowLink$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromWorkflowActions.GET_WORKFLOW_LINK),
      switchMap((action: fromWorkflowActions.GetWorkflowLink) =>
        this.jobDescriptionWorkflowApiService.getWorkflowLink(action.payload.workflowId).pipe(
          map((response: string) => {
            return new fromWorkflowActions.GetWorkflowLinkSuccess(response);
          }),
          catchError(response => of(new fromWorkflowActions.GetWorkflowLinkError(response)))
        )
      ));

      @Effect()
      resendEmail$: Observable<Action> = this.actions$
        .pipe(
          ofType(fromWorkflowActions.RESEND_EMAIL),
          switchMap((action: fromWorkflowActions.ResendEmail) =>
            this.jobDescriptionWorkflowApiService.resendEmail(action.payload.workflowId).pipe(
              map(() => {
                return new fromWorkflowActions.ResendEmailSuccess();
              }),
              catchError(response => of(new fromWorkflowActions.ResendEmailError()))
            )
          ));

  @Effect()
  loadWorkflowLogEntries$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromWorkflowActions.LOAD_WORKFLOW_LOG_ENTRIES),
      switchMap((action: fromWorkflowActions.LoadWorkflowLogEntries) =>
        this.jobDescriptionWorkflowApiService.getRoutingHistory(action.payload.jobDescriptionId, action.payload.jobDescriptionRevision, 'JobDescription')
          .pipe(
            map((response: string) => {
              return new fromWorkflowActions.LoadWorkflowLogEntriesSuccess(response);
            }),
          catchError(response => of(new fromWorkflowActions.LoadWorkflowLogEntriesError(response)))
        )
      ));

  @Effect()
  cancelApproval$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromWorkflowActions.CANCEL_APPROVAL),
      switchMap((action: fromWorkflowActions.CancelApproval) =>
        this.jobDescriptionWorkflowApiService.cancel(action.payload.WorkflowId, action.payload.Comment)
          .pipe(
            map((response: JobDescriptionDataResponse) => {
              const jobDescriptionData = PayfactorsApiModelMapper.mapJDDataResponseToJDDataResponseItem(response);
              return new fromJobDescriptionActions.GetJobDescription(jobDescriptionData);
            }),
            catchError(error => of(new fromJobDescriptionActions.GetJobDescriptionError(error)))
          )
      ));

  @Effect()
  approveWorkflowStep: Observable<Action> = this.actions$
    .pipe(
      ofType(fromWorkflowActions.APPROVE_WORKFLOW_STEP),
      switchMap((action: fromWorkflowActions.ApproveWorkflowStep) =>
        this.jobDescriptionWorkflowApiService.completeStep(action.payload.workflowStepInfo.WorkflowId, action.payload.willProceed, action.payload.comment)
          .pipe(
            map(() => {
              return new fromWorkflowActions.CompleteWorkflowStepSuccess({
                workflowStepInfo: action.payload.workflowStepInfo, willProceed: action.payload.willProceed});
            }),
            catchError(() => of(new fromWorkflowActions.CompleteWorkflowStepError()))
          )
      ));

  @Effect()
  rejectWorkflowStep: Observable<Action> = this.actions$
    .pipe(
      ofType(fromWorkflowActions.REJECT_WORKFLOW_STEP),
      switchMap((action: fromWorkflowActions.RejectWorkflowStep) =>
        this.jobDescriptionWorkflowApiService.completeStep(action.payload.workflowStepInfo.WorkflowId, action.payload.willProceed, action.payload.comment)
          .pipe(
            map(() => {
              return new fromWorkflowActions.CompleteWorkflowStepSuccess({
                workflowStepInfo: action.payload.workflowStepInfo, willProceed: action.payload.willProceed});
            }),
            catchError(() => of(new fromWorkflowActions.CompleteWorkflowStepError()))
          )
      ));

  @Effect()
  completeWorkflowStepSuccess = this.actions$
    .pipe(
      ofType(fromWorkflowActions.COMPLETE_WORKFLOW_STEP_SUCCESS),
      map((action: fromWorkflowActions.CompleteWorkflowStepSuccess) => {
        let completionMessage = '';
        const workflowStepInfo = action.payload.workflowStepInfo;
        const willProceed = action.payload.willProceed;
        if (workflowStepInfo.IsFirstStep && !willProceed) {
          this.router.navigate(['/client/job-description-management/job-descriptions']);
        } else {
          if (!workflowStepInfo.IsLastStep && willProceed) {
            completionMessage = 'Thank you for reviewing and approving this job description. It has been routed to the next approver for their review.';
          } else if (!willProceed) {
            completionMessage = 'This job description has been rejected and sent back to the previous approver. ' +
              'You will receive the job description to review once it has been re-submitted for approval.';
          } else {
            completionMessage = 'Thank you for reviewing and approving this job description. It has now been Published and made official.';
          }
          return new fromWorkflowActions.SetMessage({message: completionMessage});
        }
      })
    );

  @Effect()
  savingWorkflow$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromWorkflowActions.SAVING_WORKFLOW),
      switchMap((action: fromWorkflowActions.SavingWorkflow) =>
        this.jobDescriptionWorkflowApiService.create(action.payload)
          .pipe(
            map((response) => {
              return new fromWorkflowActions.SavingWorkflowSuccess();
            }),
            catchError(() => of(new fromWorkflowActions.SavingWorkflowError()))
          )
      ));

  @Effect({dispatch: false})
  savingWorkflowSuccess = this.actions$
    .pipe(
      ofType(fromWorkflowActions.SAVING_WORKFLOW_SUCCESS),
      tap((action: fromWorkflowActions.SavingWorkflowSuccess) => {
        this.router.navigate(['job-description-management/job-descriptions']);
      })
    );


  @Effect({dispatch: false})
  setMessage$ = this.actions$
    .pipe(
      ofType(fromWorkflowActions.SET_MESSAGE),
      tap((action: fromWorkflowActions.SetMessage) => {
        this.router.navigate(['/workflow-complete']);
      })
    );

  constructor(
    private actions$: Actions,
    private jobDescriptionWorkflowApiService: JobDescriptionWorkflowApiService,
    private router: Router,
  ) {}
}
