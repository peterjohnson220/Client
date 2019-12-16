import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, concatMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionWorkflowTemplateApiService } from 'libs/data/payfactors-api';

import * as fromSharedWorkflowConfigAction from '../../../shared/actions';
import * as fromWorkflowActions from '../actions';

@Injectable()
export class RoutingWorkflowsUpsertEffects {

    @Effect()
    saveWorkflowTemplate$: Observable<Action> = this.actions$
    .pipe(
        ofType(fromWorkflowActions.SAVE_WORKFLOW_TEMPLATE),
        switchMap((action: fromWorkflowActions.SaveWorkflowTemplate) =>
            this.workflowTemplateApiService.saveTemplate(action.payload.template)
            .pipe(
                map(() => {
                    return new fromWorkflowActions.SaveWorkflowTemplateSuccess();
                }),
                catchError(() => of(new fromWorkflowActions.SaveWorkflowTemplateError({errorMessage: 'Error saving workflow template.'})))
            )
        )
    );

    @Effect()
    saveWorkflowTemplateSuccess$: Observable<Action> = this.actions$
    .pipe(
        ofType(fromWorkflowActions.SAVE_WORKFLOW_TEMPLATE_SUCCESS),
        concatMap(() => {
            return [
                new fromWorkflowActions.CloseUpsertWorkflowTemplateModal(),
                new fromWorkflowActions.LoadWorkflowTemplates()
              ];
          })
    );

    @Effect()
    closeSaveWorkflowTemplate$: Observable<Action> = this.actions$
    .pipe(
        ofType(fromWorkflowActions.CLOSE_UPSERT_WORKFLOW_TEMPLATE_MODAL),
        concatMap(() => {
            return [
                new fromSharedWorkflowConfigAction.ResetWorkflow()
              ];
          })
    );

    constructor(
      private actions$: Actions,
      private workflowTemplateApiService: JobDescriptionWorkflowTemplateApiService
    ) {}
}
