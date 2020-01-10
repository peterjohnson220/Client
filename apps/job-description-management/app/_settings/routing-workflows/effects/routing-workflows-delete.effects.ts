import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, concatMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionWorkflowTemplateApiService } from 'libs/data/payfactors-api';

import * as fromWorkflowActions from '../actions';

@Injectable()
export class RoutingWorkflowsDeleteEffects {

    @Effect()
    deleteWorkflowTemplate$: Observable<Action> = this.actions$
    .pipe(
        ofType(fromWorkflowActions.DELETE_WORKFLOW_TEMPLATE),
        switchMap((action: fromWorkflowActions.DeleteWorkflowTemplate) =>
            this.workflowTemplateApiService.deleteTemplate(action.payload.templateId)
            .pipe(
                map(() => {
                    return new fromWorkflowActions.DeleteWorkflowTemplateSuccess();
                }),
                catchError(() => of(new fromWorkflowActions.DeleteWorkflowTemplateError({errorMessage: 'Error deleting workflow template.'})))
            )
        )
    );

    @Effect()
    deleteWorkflowTemplateSuccess$: Observable<Action> = this.actions$
    .pipe(
        ofType(fromWorkflowActions.DELETE_WORKFLOW_TEMPLATE_SUCCESS),
        concatMap((response) => {
            return [
                // new fromWorkflowActions.CloseDeleteControlModal(),
                new fromWorkflowActions.LoadWorkflowTemplates()
              ];
          })
    );

    constructor(
      private actions$: Actions,
      private workflowTemplateApiService: JobDescriptionWorkflowTemplateApiService
    ) {}
}
