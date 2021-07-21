import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { JobDescriptionWorkflowApiService } from 'libs/data/payfactors-api/jdm';

import * as fromWorkflowSetupModalActions from '../actions/workflow-setup-modal.actions';
import * as fromWorkflowConfigActions from 'libs/features/jobs/job-description-management/actions/workflow-config.actions';

@Injectable()
export class WorkflowSetupModalEffects {

  @Effect()
  createWorkflow$ = this.actions$
    .pipe(
      ofType(fromWorkflowSetupModalActions.CREATE_WORKFLOW),
      switchMap((action: fromWorkflowSetupModalActions.CreateWorkflow) => {
        return this.jobDescriptionWorkflowApiService.create(action.payload)
          .pipe(
            switchMap(() => [
              new fromWorkflowConfigActions.ResetWorkflow(),
            ]),
            catchError(() => of(new fromWorkflowSetupModalActions.CreateWorkflowError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private jobDescriptionWorkflowApiService: JobDescriptionWorkflowApiService
  ) {}
}
