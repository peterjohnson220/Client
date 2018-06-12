import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { of , Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { DashboardApiService } from 'libs/data/payfactors-api';
import { TimelineActivityResponse } from 'libs/models/dashboard';

import * as fromTimelineActivityAction from '../actions/timeline-activity.actions';

@Injectable()
export class TimelineActivityEffects {
  @Effect()
  loadingTimelineActivity$: Observable<Action> = this.actions$
    .ofType(fromTimelineActivityAction.LOADING_ACTIVITY).pipe(
      switchMap((action: fromTimelineActivityAction.LoadingActivity) =>
        this.dashboardApiService.getTimelineActivities(action.payload).pipe(
          map((response: TimelineActivityResponse) => new fromTimelineActivityAction.LoadingActivitySuccess(response)),
          catchError(error  => of (new fromTimelineActivityAction.LoadingActivityError(error)))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private dashboardApiService: DashboardApiService
  ) {
  }
}

