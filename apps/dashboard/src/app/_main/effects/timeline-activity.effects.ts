import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import { DashboardApiService } from 'libs/data/payfactors-api';
import { TimelineActivityDto } from '../../../../../../libs/models/dashboard';

import * as fromTimelineActivityAction from '../actions/timeline-activity.actions';

@Injectable()
export class TimelineActivityEffects {
  @Effect()
  loadingTimelineActivity$: Observable<Action> = this.actions$
    .ofType(fromTimelineActivityAction.LOADING_ACTIVITY)
    .switchMap(() =>
      this.dashboardApiService.getTimelineActivities()
        .map((timelineActivities: TimelineActivityDto[]) => new fromTimelineActivityAction.LoadingActivitySuccess(timelineActivities))
        .catch(error  => of (new fromTimelineActivityAction.LoadingActivityError(error)))
    );

  constructor(
    private actions$: Actions,
    private dashboardApiService: DashboardApiService
  ) {
  }
}

