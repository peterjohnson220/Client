import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ProjectTemplatesApiService } from 'libs/data/payfactors-api/index';
import { ProjectTemplate } from 'libs/models';
import * as fromProjectTemplateManagementActions from 'libs/features/projects/project-template-management/actions/project-template-management.actions';

import * as fromProjectTemplateActions from '../actions/project-template.actions';
import * as fromUserSettingsReducer from '../reducers';

@Injectable()
export class ProjectTemplateEffects {

  @Effect()
  getProjectTemplates$ = this.actions$
    .pipe(
      ofType(fromProjectTemplateActions.GET_PROJECT_TEMPLATES),
      switchMap((action: fromProjectTemplateActions.GetProjectTemplates) => {
        return this.projectTemplatesApiService.getProjectTemplates()
          .pipe(
            map((projectTemplates: ProjectTemplate[]) =>  new fromProjectTemplateActions.GetProjectTemplatesSuccess(projectTemplates)),
            catchError(() => of(new fromProjectTemplateActions.GetProjectTemplatesError()))
          );
      })
    );

  @Effect()
  deleteProjectTemplate$ = this.actions$
    .pipe(
      ofType(fromProjectTemplateActions.DELETE_PROJECT_TEMPLATE),
      switchMap((action: fromProjectTemplateActions.DeleteProjectTemplate) => {
        return this.projectTemplatesApiService.delete(action.payload)
          .pipe(
            map(() =>  new fromProjectTemplateActions.DeleteProjectTemplateSuccess(action.payload)),
            catchError(() => of(new fromProjectTemplateActions.DeleteProjectTemplateError()))
          );
      })
    );

  @Effect()
  saveProjectTemplateFieldsSuccess$ = this.actions$
    .pipe(
      ofType(fromProjectTemplateManagementActions.SAVE_PROJECT_TEMPLATE_FIELDS_SUCCESS),
      map((action: fromProjectTemplateManagementActions.SaveProjectTemplateFieldsSuccess) => {
        return new fromProjectTemplateActions.GetProjectTemplates();
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromUserSettingsReducer.State>,
    private projectTemplatesApiService: ProjectTemplatesApiService
  ) {}
}

