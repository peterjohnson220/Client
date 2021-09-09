import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { JobDescriptionManagementApiService } from 'libs/data/payfactors-api';

import * as fromCollaborationWorkflowConfigActions from 'libs/features/jobs/job-description-management/actions/collaboration-workflow-config.actions';
import { WorkflowUser } from 'libs/features/jobs/job-description-management/models';
import { WorkflowConfigHelper } from 'libs/features/jobs/job-description-management/helpers';

@Injectable()
export class CollaborationWorkflowConfigEffects {

  @Effect()
  addNonPfUserToWorkflow$ = this.actions$
    .pipe(
      ofType(fromCollaborationWorkflowConfigActions.ADD_NON_PF_USER_TO_COLLABORATION_WORKFLOW),
      switchMap((action: fromCollaborationWorkflowConfigActions.AddNonPfUserToCollaborationWorkflow) => {
        return this.jdmApiService.userEmailHasJobPermission(action.payload.EmailAddress, action.payload.JobIds)
          .pipe(
            map((hasPermission: boolean) => {
              const workflowUser: WorkflowUser = WorkflowConfigHelper.buildWorkflowUser(action.payload, hasPermission);
              return new fromCollaborationWorkflowConfigActions.AddSelectedUserOrEmailToCollaborationWorkflow(workflowUser);
            }),
            catchError(() => of(new fromCollaborationWorkflowConfigActions.AddNonPfUserToCollaborationWorkflowError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private jdmApiService: JobDescriptionManagementApiService
  ) {}
}
