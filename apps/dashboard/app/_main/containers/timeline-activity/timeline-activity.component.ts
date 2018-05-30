import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromTimelineActivityReducer from '../../reducers';
import * as fromTimelineActivityActions from '../../actions/timeline-activity.actions';

import { Feature, TimelineActivity, TimelineActivityFilter } from '../../models';
import { TimelineActivityMapper } from '../../mappers';


@Component({
  selector: 'pf-timeline-activity',
  templateUrl: './timeline-activity.component.html',
  styleUrls: [ './timeline-activity.component.scss' ]
})
export class TimelineActivityComponent implements OnInit {
  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;
  timelineActivities$: Observable<TimelineActivity[]>;
  timelineActivityFilters$: Observable<TimelineActivityFilter[]>;
  timelineActivitiesPage$: Observable<number>;
  timelineActivitiesHasMoreData$: Observable<boolean>;
  features$: Observable<Feature[]>;

  timelineActivities: TimelineActivity[];
  timelineActivityFilters: TimelineActivityFilter[];
  timelineActivitiesFiltered: TimelineActivity[];
  showFiltersPanel: boolean;
  timelineActivitiesPage: number;
  timelineActivitiesHasMoreData: boolean;
  ACTIVITY_TYPE: string = TimelineActivityMapper.ACTIVITY_TYPE;
  COMMUNITY_TYPE: string = TimelineActivityMapper.COMMUNITY_TYPE;
  RESOURCES_TYPE: string = TimelineActivityMapper.RESOURCES_TYPE;
  JOB_DESCRIPTION_TYPE: string = TimelineActivityMapper.JOB_DESCRIPTIONS_TYPE;

  constructor(private store: Store<fromTimelineActivityReducer.State>) {
    this.features$ = this.store.select(fromTimelineActivityReducer.getFeatures);
    this.loading$ = this.store.select(fromTimelineActivityReducer.getTimelineActivityLoading);
    this.loadingError$ = this.store.select(fromTimelineActivityReducer.getTimelineActivityLoadingError);
    this.timelineActivities$ = this.store.select(fromTimelineActivityReducer.getTimelineActivities);
    this.timelineActivitiesPage$ = this.store.select(fromTimelineActivityReducer.getTimelineActivityCurrentPage);
    this.timelineActivitiesHasMoreData$ = this.store.select(fromTimelineActivityReducer.getTimelineActivityHasMoreData);
    this.timelineActivityFilters$ = this.store.select((fromTimelineActivityReducer.getTimelineActivityFilters));
    this.timelineActivitiesPage = 0;
    this.timelineActivitiesHasMoreData = false;
    this.showFiltersPanel = false;
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

        // Generate TimelineActivityFilters based on features
        const generatedFilters = this.generateFiltersFromTimelineActivityType(timelineActivityTypes);
        this.store.dispatch(new fromTimelineActivityActions.SetActivityFilters(generatedFilters));

        // Dispatch LoadingActivity for enabled types
        this.store.dispatch(
          new fromTimelineActivityActions.LoadingActivity({
            Page: 1,
            RecordsPerPage: 5,
            TypesToRetrieve: timelineActivityTypes
          })
        );
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

    this.timelineActivityFilters$.subscribe(filters => {
      this.timelineActivityFilters = filters;
    });

    this.timelineActivitiesHasMoreData$.subscribe(hasMore => {
      this.timelineActivitiesHasMoreData = hasMore;
    });

    this.timelineActivitiesPage$.subscribe(page => {
      this.timelineActivitiesPage = page;
    });
  }

  // events
  toggleFilter(filterValue: string) {
    this.store.dispatch(new fromTimelineActivityActions.FilterActivity(filterValue));
  }

  toggleFilterPanel() {
    this.showFiltersPanel = !this.showFiltersPanel;
  }

  shouldShowMore(): boolean {
    return this.timelineActivitiesHasMoreData && this.hasActiveFilters();
  }

  handleShowMore() {
    let page = this.timelineActivitiesPage + 1;
    if (this.timelineActivities.length <= 5 ) {
      page = 1;
    }
    this.store.dispatch(
      new fromTimelineActivityActions.LoadingActivity({
        Page: page,
        RecordsPerPage: 25,
        TypesToRetrieve: this.getTimelineActivityTypes()
      })
    );
  }

  // Helpers
  getTimelineActivityTypes(): string[] {
      const types = [];
      for (const filter of this.timelineActivityFilters) {
        types.push(filter.Value);
      }
      return types;
  }

  hasActiveFilters(): boolean {
    for (const filter of this.timelineActivityFilters) {
      if (filter.IsEnabled) {
        return true;
      }
    }
    return false;
  }

  generateFiltersFromTimelineActivityType(timelineActivityTypes: string[]): TimelineActivityFilter[] {
    const timelineActivityFilters = [];
    for (const timelineActivityType of timelineActivityTypes) {
      switch (timelineActivityType) {
        case TimelineActivityMapper.ACTIVITY_TYPE: {
          timelineActivityFilters.push({
            Label: 'Project Activity',
            Value: timelineActivityType,
            IsEnabled: true
          });
          break;
        }
        case TimelineActivityMapper.COMMUNITY_TYPE: {
          timelineActivityFilters.push({
            Label: 'Community',
            Value: timelineActivityType,
            IsEnabled: true
          });
          break;
        }
        case TimelineActivityMapper.RESOURCES_TYPE: {
          timelineActivityFilters.push({
            Label: 'Resources',
            Value: timelineActivityType,
            IsEnabled: true
          });
          break;
        }
        case TimelineActivityMapper.JOB_DESCRIPTIONS_TYPE: {
          timelineActivityFilters.push({
            Label: 'Job Descriptions',
            Value: timelineActivityType,
            IsEnabled: true
          });
          break;
        }
      }
    }
    return timelineActivityFilters;
  }
}
