import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';
import { JobInformationFieldForBulkExportResponse } from 'libs/models/payfactors-api/job-description/response';

import * as fromJobInfoViewEditorActions from '../actions/job-info-view-editor.actions';
import * as fromViewEditReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../../shared/helpers';

@Injectable()
export class JobInfoViewEditorEffects {

  @Effect()
  getJobInformationFields$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobInfoViewEditorActions.GET_JOB_INFORMATION_FIELDS),
      withLatestFrom(
        this.store.pipe(select(fromViewEditReducer.getViewEditViewName)),
        (action: fromJobInfoViewEditorActions.GetJobInformationFields, viewName) => viewName
      ),
      switchMap((viewName) => {
        return this.jobDescriptionApiService.getJobInformationFieldsForBulkExport(viewName)
        .pipe(
          map((response: JobInformationFieldForBulkExportResponse[]) => {
            return new fromJobInfoViewEditorActions.GetJobInformationFieldsSuccess(
              PayfactorsApiModelMapper.mapJobInformationFieldResponseToJobInfoViewField(response)
            );
          }),
          catchError(() => of(new fromJobInfoViewEditorActions.GetJobInformationFieldsError()))
        );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromViewEditReducer.State>,
    private router: Router,
    private jobDescriptionApiService: JobDescriptionApiService
  ) { }
}
