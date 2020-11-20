import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, catchError, mergeMap } from 'rxjs/operators';

import { ProjectTemplatesApiService } from 'libs/data/payfactors-api';

import * as fromProjectTemplateManagementReducer from '../reducers';
import * as fromProjectTemplateActions from '../actions';

@Injectable()
export class ProjectTemplateManagementEffects {

  @Effect()
  createNewTemplate$ = this.actions$
    .pipe(
      ofType(fromProjectTemplateActions.CREATE_NEW_TEMPLATE),
      mergeMap((action: fromProjectTemplateActions.CreateNewTemplate) => {
        return [
          new fromProjectTemplateActions.ShowProjectTemplateForm(true),
          new fromProjectTemplateActions.GetProjectTemplateFields()
        ];
      })
    );

  @Effect()
  getProjectTemplateFields$ = this.actions$
    .pipe(
      ofType(fromProjectTemplateActions.GET_PROJECT_TEMPLATE_FIELDS),
      switchMap((action: fromProjectTemplateActions.GetProjectTemplateFields) => {
        return this.projectTemplateApiService.getProjectTemplateFields(action.payload)
          .pipe(
            map((response) => new fromProjectTemplateActions.GetProjectTemplateFieldsSuccess(response)),
            catchError(() => of(new fromProjectTemplateActions.GetProjectTemplateFieldsError()))
          );
      })
    );

  @Effect()
  saveProjectTemplate$ = this.actions$
    .pipe(
      ofType(fromProjectTemplateActions.SAVE_PROJECT_TEMPLATE_FIELDS),
      switchMap((action: fromProjectTemplateActions.SaveProjectTemplateFields) => {
        return this.projectTemplateApiService.saveProjectTemplate(action.payload, null)
          .pipe(
            map((response) => new fromProjectTemplateActions.SaveProjectTemplateFieldsSuccess()),
            catchError((response) => {
              const errorMessage = response.status === 409 ?
                'This template name is already used. Please choose a unique template name.'
                : 'An error has occurred. Please try again later';
              return of(new fromProjectTemplateActions.SaveProjectTemplateFieldsError(errorMessage));
            })
          );
      })
    );

  @Effect()
  saveProjectTemplateFieldsSuccess$ = this.actions$
    .pipe(
      ofType(fromProjectTemplateActions.SAVE_PROJECT_TEMPLATE_FIELDS_SUCCESS),
      map((action: fromProjectTemplateActions.SaveProjectTemplateFieldsSuccess) => {
        return new fromProjectTemplateActions.ShowProjectTemplateForm(false);
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromProjectTemplateManagementReducer.State>,
    private projectTemplateApiService: ProjectTemplatesApiService
  ) {}
}
