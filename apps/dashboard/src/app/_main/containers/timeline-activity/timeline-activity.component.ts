import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromTimelineActivityReducer from '../../reducers';
import * as fromTimelineActivityActions from '../../actions/timeline-activity.actions';

import { Feature, TimelineActivity } from '../../models';
import { TimelineActivityMapper } from '../../mappers';
import { TimelineActivityFilter } from '../../models/filter.model';

@Component({
  selector: 'pf-timeline-activity',
  templateUrl: './timeline-activity.component.html',
  styleUrls: [ './timeline-activity.component.scss' ]
})
export class TimelineActivityComponent implements OnInit {
  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;
  timelineActivities$: Observable<TimelineActivity[]>;
  timelineActivitiesPage$: Observable<number>;
  timelineActivitiesHasMoreData$: Observable<boolean>;
  timelineActivities: TimelineActivity[];
  timelineActivitiesFiltered: TimelineActivity[];
  features$: Observable<Feature[]>;
  timelineActivityFilters: TimelineActivityFilter[];
  showFilter: boolean;
  ACTIVITY_TYPE: string = TimelineActivityMapper.ACTIVITY_TYPE;
  COMMUNITY_TYPE: string = TimelineActivityMapper.COMMUNITY_TYPE;
  RESOURCES_TYPE: string = TimelineActivityMapper.RESOURCES_TYPE;

  constructor(private store: Store<fromTimelineActivityReducer.State>) {
    this.features$ = this.store.select(fromTimelineActivityReducer.getFeatures);
    this.loading$ = this.store.select(fromTimelineActivityReducer.getTimelineActivityLoading);
    this.loadingError$ = this.store.select(fromTimelineActivityReducer.getTimelineActivityLoadingError);
    this.timelineActivities$ = this.store.select(fromTimelineActivityReducer.getTimelineActivities);
    this.timelineActivitiesPage$ = this.store.select(fromTimelineActivityReducer.getTimelineActivityCurrentPage);
    this.timelineActivitiesHasMoreData$ = this.store.select(fromTimelineActivityReducer.getTimelineActivityHasMoreData);
    this.timelineActivityFilters = [];
    this.showFilter = false;
  }

  // Lifecycle
  ngOnInit() {
    this.registerFeaturesSubscription();
    this.registerTimelineActivitiesSubscription();
  }

  // Subscriptions
  registerFeaturesSubscription() {
    this.features$.subscribe(features => {
      if (features.length > 0) {
        const timelineActivityTypes = TimelineActivityMapper.mapFeaturesToTimelineActivityTypes(features);
        // Dispatch LoadingActivity for enabled types
        this.store.dispatch(
          new fromTimelineActivityActions.LoadingActivity(timelineActivityTypes)
        );

        // Generate TimelineActivityFilters based on features
        this.generateFiltersFromTimelineActivityType(timelineActivityTypes);
      }
    });
  }

  registerTimelineActivitiesSubscription() {
    this.timelineActivities$.subscribe(timelineActivities => {
      this.timelineActivities = timelineActivities;
      this.timelineActivitiesFiltered = this.timelineActivities.filter(function(activity) {
        return activity.IsVisible;
      });
    });
  }

  // events
  toggleFilter(filterValue: string) {
    for (const filter of this.timelineActivityFilters) {
      if (filter.Value === filterValue) {
        filter.IsEnabled = !filter.IsEnabled;
        this.store.dispatch(new fromTimelineActivityActions.FilterActivity(this.applyFilter()));
      }
    }
  }

  toggleFilterMenu() {
    this.showFilter = !this.showFilter;
  }

  // Helpers
  generateFiltersFromTimelineActivityType(timelineActivityTypes: string[]) {
    this.timelineActivityFilters = [];
    for (const timelineActivityType of timelineActivityTypes) {
      switch (timelineActivityType) {
        case TimelineActivityMapper.ACTIVITY_TYPE: {
          this.timelineActivityFilters.push({
            Label: 'Project Activity',
            Value: timelineActivityType,
            IsEnabled: true
          });
          break;
        }
        case TimelineActivityMapper.COMMUNITY_TYPE: {
          this.timelineActivityFilters.push({
            Label: 'Community',
            Value: timelineActivityType,
            IsEnabled: true
          });
          break;
        }
        case TimelineActivityMapper.RESOURCES_TYPE: {
          this.timelineActivityFilters.push({
            Label: 'Resources',
            Value: timelineActivityType,
            IsEnabled: true
          });
          break;
        }
        case TimelineActivityMapper.JOB_DESCRIPTIONS_TYPE: {
          this.timelineActivityFilters.push({
            Label: 'Job Descriptions',
            Value: timelineActivityType,
            IsEnabled: true
          });
          break;
        }
      }
    }
  }

  applyFilter(): TimelineActivity[] {
    const newTimelineActivities = [];
    for (const timelineActivity of this.timelineActivities) {
      for (const filter of this.timelineActivityFilters) {
        if (timelineActivity.Type === filter.Value) {
          const newTimelineActivity = {...timelineActivity};
          newTimelineActivity.IsVisible = filter.IsEnabled;
          newTimelineActivities.push(newTimelineActivity);
        }
      }
    }
    return newTimelineActivities;
  }
}
