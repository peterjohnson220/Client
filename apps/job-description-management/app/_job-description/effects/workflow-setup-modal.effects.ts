import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
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
              new fromWorkflowSetupModalActions.CreateWorkflowSuccess(),
              new fromWorkflowConfigActions.ResetWorkflow()
            ]),
            catchError(() => of(new fromWorkflowSetupModalActions.CreateWorkflowError()))
          );
      })
    );

  @Effect({ dispatch: false })
  createWorkflowSuccess$ = this.actions$
    .pipe(
      ofType(fromWorkflowSetupModalActions.CREATE_WORKFLOW_SUCCESS),
      tap(() => {
        this.router.navigate(['/job-descriptions']);
      })
    );

  constructor(
    private actions$: Actions,
    private jobDescriptionWorkflowApiService: JobDescriptionWorkflowApiService,
    private router: Router
  ) {}
}
