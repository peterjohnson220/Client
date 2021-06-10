import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { map, switchMap, catchError, mergeMap, withLatestFrom } from 'rxjs/operators';

import { ProjectTemplateApiService } from 'libs/data/payfactors-api';
import * as fromRootState from 'libs/state/state';

import * as fromProjectTemplateManagementReducer from '../reducers';
import * as fromProjectTemplateActions from '../actions';
import { ProjectTemplateHelper } from '../helpers';

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
  editProjectTemplate$ = this.actions$
    .pipe(
      ofType(fromProjectTemplateActions.EDIT_TEMPLATE),
      mergeMap((action: fromProjectTemplateActions.EditTemplate) => {
        return [
          new fromProjectTemplateActions.ShowProjectTemplateForm(true),
          new fromProjectTemplateActions.GetProjectTemplateFields(action.payload)
        ];
      })
    );

  @Effect()
  getProjectTemplateFields$ = this.actions$
    .pipe(
      ofType(fromProjectTemplateActions.GET_PROJECT_TEMPLATE_FIELDS),
      withLatestFrom(
        this.userContextStore.pipe(select(fromRootState.getUserContext)),
        (action: fromProjectTemplateActions.GetProjectTemplateFields, userContext) =>
          ({ action, userContext })
      ),
      switchMap((data) => {
        return this.projectTemplateApiService.getProjectTemplateFields(data.action.payload)
          .pipe(
            map((response) =>
              new fromProjectTemplateActions
                .GetProjectTemplateFieldsSuccess(
                  ProjectTemplateHelper.setTemplateFieldsCompanyName(response, data.userContext.CompanyName)
                )),
            catchError(() => of(new fromProjectTemplateActions.GetProjectTemplateFieldsError()))
          );
      })
    );

  @Effect()
  saveProjectTemplate$ = this.actions$
    .pipe(
      ofType(fromProjectTemplateActions.SAVE_PROJECT_TEMPLATE_FIELDS),
      withLatestFrom(
        this.store.pipe(select(fromProjectTemplateManagementReducer.getProjectTemplateId)),
        (action: fromProjectTemplateActions.SaveProjectTemplateFields, projectTemplateId) =>
          ({ action, projectTemplateId })
      ),
      switchMap((data) => {
        return this.projectTemplateApiService.saveProjectTemplate(data.action.payload, data.projectTemplateId)
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
    private userContextStore: Store<fromRootState.State>,
    private projectTemplateApiService: ProjectTemplateApiService
  ) {}
}
