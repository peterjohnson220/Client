import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { JobDescriptionManagementApiService } from 'libs/data/payfactors-api';

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
        return this.jdmApiService.userEmailHasJobPermission(action.payload.EmailAddress, action.payload.JobId)
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

  constructor(
    private actions$: Actions,
    private jdmApiService: JobDescriptionManagementApiService
  ) {}
}
