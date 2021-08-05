import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';

import { JobDescriptionManagementApiService, JobDescriptionWorkflowApiService } from 'libs/data/payfactors-api';

import * as fromWorkflowConfigActions from 'libs/features/jobs/job-description-management/actions/workflow-config.actions';
import { WorkflowUser } from 'libs/features/jobs/job-description-management/models';
import { WorkflowConfigHelper } from 'libs/features/jobs/job-description-management/helpers';

@Injectable()
export class WorkflowConfigEffects {

  @Effect()
  addNonPfUserToWorkflow$ = this.actions$
    .pipe(
      ofType(fromWorkflowConfigActions.ADD_NON_PF_USER_TO_WORKFLOW),
      switchMap((action: fromWorkflowConfigActions.AddNonPfUserToWorkflow) => {
        return this.jdmApiService.userEmailHasJobPermission(action.payload.EmailAddress, action.payload.JobIds)
          .pipe(
            map((hasPermission: boolean) => {
              const workflowUser: WorkflowUser = WorkflowConfigHelper.buildWorkflowUser(action.payload, hasPermission);
              if (action.payload.StepIndex === null) {
                return new fromWorkflowConfigActions.CreateWorkflowStep(workflowUser);
              } else {
                return new fromWorkflowConfigActions.AddUserToWorkflowStep({
                  stepIndex: action.payload.StepIndex,
                  workflowUser
                });
              }
            }),
            catchError(() => of(new fromWorkflowConfigActions.AddNonPfUserToWorkflowError()))
          );
      })
    );

  @Effect()
  deleteWorkflowAttachmentFiles$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromWorkflowConfigActions.DELETE_WORKFLOW_ATTACHMENT_FILES),
      switchMap((action: fromWorkflowConfigActions.DeleteWorkflowAttachmentFiles) =>
        this.jdmWorkflowApiService.deleteWorkflowAttachments(action.payload).pipe(
          map((response: string[]) => {
            return new fromWorkflowConfigActions.DeleteWorkflowAttachmentFilesSuccess();
          }),
          catchError(response => of(new fromWorkflowConfigActions.DeleteWorkflowAttachmentFilesError()))
        )
      ));

  constructor(
    private actions$: Actions,
    private jdmApiService: JobDescriptionManagementApiService,
    private jdmWorkflowApiService: JobDescriptionWorkflowApiService
  ) {}
}
