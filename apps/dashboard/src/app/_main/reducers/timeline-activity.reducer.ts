import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { TimelineActivity } from '../models';

import * as fromTimelineActivityActions from '../actions/timeline-activity.actions';

export interface State extends EntityState<TimelineActivity> {
  loading: boolean;
  loadingError: boolean;
  filtering: boolean;
  filteringError: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<TimelineActivity> = createEntityAdapter<TimelineActivity>({
  selectId: (timelineActivity: TimelineActivity) => timelineActivity.Type + timelineActivity.Id
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  filtering: false,
  filteringError: false
});

// Reducer
export function reducer(state = initialState, action: fromTimelineActivityActions.Actions): State {
  switch (action.type) {
    case fromTimelineActivityActions.LOADING_ACTIVITY: {
      return {
        ...state,
        loading: true
      };
    }
    case fromTimelineActivityActions.LOADING_ACTIVITY_SUCCESS: {
      return {
        ...adapter.addAll(action.payload, state),
        loading: false
      };
    }
    case fromTimelineActivityActions.LOADING_ACTIVITY_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromTimelineActivityActions.FILTER_ACTIVITY: {
      return {
        ...state,
        filtering: true
      };
    }
    case fromTimelineActivityActions.FILTER_ACTIVITY_SUCCESS: {
      return {
        ...adapter.removeMany(action.payload, state),
        filtering: false
      };
    }
    case fromTimelineActivityActions.FILTER_ACTIVITY_ERROR: {
      return {
        ...state,
        filtering: false,
        filteringError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getFiltering = (state: State) => state.filtering;
export const getFilteringError = (state: State) => state.filteringError;
