import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionWorkflowApiService, JobDescriptionWorkflowTemplateApiService } from 'libs/data/payfactors-api/jdm';

import * as fromSharedWorkflowActions from 'libs/features/job-description-management/actions/shared-workflow.actions';
import { JobDescriptionManagementService } from 'libs/features/job-description-management/services';


@Injectable()
export class SharedWorkflowEffects {
  @Effect()
  load$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedWorkflowActions.LOAD),
      switchMap((action: fromSharedWorkflowActions.Load) =>
        this.workflowTemplateApiService.getTemplateListWithJobFilter(action.payload).pipe(
          map((response: any) => {
            return new fromSharedWorkflowActions.LoadSuccess({templateList: response});
          }),
          catchError(() => of(new fromSharedWorkflowActions.LoadError()))
        )
      ));

  @Effect()
  routingToNewUser$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedWorkflowActions.ROUTING_TO_NEW_USER),
      switchMap((action: fromSharedWorkflowActions.RoutingToNewUser) =>
        this.jobDescriptionWorkflowApiService.routeStepToNewUser(action.payload.workflowId, action.payload.newWorkflowUser, action.payload.comment).pipe(
          map((response: any) => {
            return new fromSharedWorkflowActions.RoutingToNewUserSuccess();
          }),
          catchError(() => of(new fromSharedWorkflowActions.RoutingToNewUserError()))
        )
      ));

  constructor(
    private actions$: Actions,
    private workflowTemplateApiService: JobDescriptionWorkflowTemplateApiService,
    private jobDescriptionManagementService: JobDescriptionManagementService,
    private jobDescriptionWorkflowApiService: JobDescriptionWorkflowApiService
  ) {}
}
