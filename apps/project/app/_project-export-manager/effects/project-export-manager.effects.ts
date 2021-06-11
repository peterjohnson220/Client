import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ProjectTemplate } from 'libs/models/projects/project-templates';
import * as fromProjectExportManagerActions from '../actions';
import { ProjectTemplatesApiService } from 'libs/data/payfactors-api/project';

@Injectable()
export class ProjectExportManagerEffects {
  constructor(private actions$: Actions,
              private projectTemplatesApiService: ProjectTemplatesApiService) {
  }

  @Effect()
  getProjectTemplates$ = this.actions$
    .pipe(
      ofType(fromProjectExportManagerActions.GET_PROJECT_TEMPLATES),
      switchMap(() => {
        return this.projectTemplatesApiService.getProjectTemplates()
          .pipe(
            map((projectTemplates: ProjectTemplate[]) =>  new fromProjectExportManagerActions.GetProjectTemplatesSuccess(projectTemplates)),
            catchError((error) => of(new fromProjectExportManagerActions.GetProjectTemplatesError(error)))
          );
      })
    );
}
