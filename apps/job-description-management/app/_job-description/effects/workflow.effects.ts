import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionWorkflowApiService } from 'libs/data/payfactors-api/jdm';

import * as fromWorkflowActions from '../actions/workflow.actions';

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

  constructor(
    private actions$: Actions,
    private jobDescriptionWorkflowApiService: JobDescriptionWorkflowApiService
  ) {}
}
