import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromTimelineActivityReducer from '../../reducers';
import * as fromTimelineActivityActions from '../../actions/timeline-activity.actions';

import { TimelineActivity } from '../../models';

@Component({
  selector: 'pf-timeline-activity',
  templateUrl: './timeline-activity.component.html',
  styleUrls: [ './timeline-activity.component.scss' ]
})
export class TimelineActivityComponent implements OnInit {
  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;
  timelineActivities$: Observable<TimelineActivity[]>;
  timelineActivities: TimelineActivity[];

  constructor(private store: Store<fromTimelineActivityReducer.State>) {
    this.loading$ = this.store.select(fromTimelineActivityReducer.getTimelineActivityLoading);
    this.loadingError$ = this.store.select(fromTimelineActivityReducer.getTimelineActivtyLoadingError);
    this.timelineActivities$ = this.store.select(fromTimelineActivityReducer.getTimelineActivities);
  }

  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromTimelineActivityActions.LoadingActivity());
    this.setTimelineActivities();
  }

  // Helpers
  setTimelineActivities() {
    this.timelineActivities$.subscribe(timelineActivities => {
      this.timelineActivities = timelineActivities;
    });
  }
}

