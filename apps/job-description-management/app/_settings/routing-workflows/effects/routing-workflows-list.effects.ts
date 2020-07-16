import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionWorkflowTemplateApiService } from 'libs/data/payfactors-api';
import { arraySortByString, SortDirection } from 'libs/core/functions';
import { WorkflowTemplate } from 'libs/features/job-description-management/models';

import * as fromWorkflowListActions from '../actions';

@Injectable()
export class RoutingWorkflowsListEffects {
  @Effect()
  load$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromWorkflowListActions.LOAD_WORKFLOW_TEMPLATE_LIST),
      switchMap(() =>
        this.workflowTemplateApiService.getTemplateList().pipe(
          map((response: WorkflowTemplate[]) => {
            return new fromWorkflowListActions.LoadWorkflowTemplatesSuccess(
              response.sort((a, b) => arraySortByString(a.Name, b.Name, SortDirection.Ascending))
            );
          }),
          catchError(() => of(new fromWorkflowListActions.LoadWorkflowTemplatesError()))
        )
      ));

  constructor(
    private actions$: Actions,
    private workflowTemplateApiService: JobDescriptionWorkflowTemplateApiService
  ) {}
}
