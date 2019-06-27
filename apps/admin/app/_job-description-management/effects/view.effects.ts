import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { JobDescriptionManagementApiService } from 'libs/data/payfactors-api';
import * as fromJdmViewActions from '../actions/view.actions';
import { JobDescriptionViewModel } from 'libs/models/jdm/job-description-view.model';

@Injectable()
export class JdmViewEffects {

  @Effect()
  loadViews$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJdmViewActions.LOADING_VIEWS),
      switchMap(() =>
        this.jobdescriptionManagementApiService.getViews().pipe(
          map((views: JobDescriptionViewModel[]) => new fromJdmViewActions.LoadingViewsSuccess({views: views})),
          catchError(error => of(new fromJdmViewActions.LoadingViewsError(error)))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private jobdescriptionManagementApiService: JobDescriptionManagementApiService
  ) {}
}
