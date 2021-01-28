import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';

import { of , Observable } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { CloudFileLocations } from 'libs/constants';
import { DashboardApiService } from 'libs/data/payfactors-api';
import { TimelineActivityResponse } from 'libs/models/dashboard';
import * as fromRootState from 'libs/state/state';

import * as fromTimelineActivityAction from '../actions/timeline-activity.actions';
import * as fromTimelineActivityReducer from '../reducers/timeline-activity.reducer';

@Injectable()
export class TimelineActivityEffects {
  @Effect()
  loadingTimelineActivity$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromTimelineActivityAction.LoadingActivity>(fromTimelineActivityAction.LOADING_ACTIVITY),
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
        (action, userContext) => {
          return {
            action,
            userContext
          };
      }),
      switchMap(obj => this.dashboardApiService.getTimelineActivities(obj.action.payload).pipe(
        map((response: TimelineActivityResponse) => {
          const baseUrl = obj.userContext.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl')?.Value + CloudFileLocations.UserAvatars;
          return new fromTimelineActivityAction.LoadingActivitySuccess({response, baseUrl});
        }),
        catchError(error  => of (new fromTimelineActivityAction.LoadingActivityError(error)))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private dashboardApiService: DashboardApiService,
    private store: Store<fromTimelineActivityReducer.State>) {
  }
}
