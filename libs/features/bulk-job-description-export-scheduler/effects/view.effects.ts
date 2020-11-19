import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { JobDescriptionManagementApiService } from 'libs/data/payfactors-api';
import { JobDescriptionViewModel } from 'libs/models/jdm/job-description-view.model';

import * as fromViewActions from '../actions/view.actions';

@Injectable()
export class BulkJobsExportScheduleViewEffects {

  @Effect()
  loadViews$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromViewActions.LOADING_VIEWS),
      switchMap(() =>
        this.jobdescriptionManagementApiService.getViews().pipe(
          map((views: JobDescriptionViewModel[]) => new fromViewActions.LoadingViewsSuccess({views: views})),
          catchError(error => of(new fromViewActions.LoadingViewsError(error)))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private jobdescriptionManagementApiService: JobDescriptionManagementApiService
  ) {}
}
