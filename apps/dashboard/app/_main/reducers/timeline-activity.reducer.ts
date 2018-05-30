import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { TimelineActivity, TimelineActivityFilter } from '../models';

import * as fromTimelineActivityActions from '../actions/timeline-activity.actions';
import { TimelineActivityMapper } from '../mappers';

export interface State extends EntityState<TimelineActivity> {
  loading: boolean;
  loadingError: boolean;
  filters: TimelineActivityFilter[];
  currentPage: number;
  hasMoreData: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<TimelineActivity> = createEntityAdapter<TimelineActivity>({
  selectId: (timelineActivity: TimelineActivity) => timelineActivity.Id
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  filters: [],
  currentPage: 0,
  hasMoreData: false
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
    case fromTimelineActivityActions.SET_ACTIVITY_FILTERS: {
      return {
        ...state,
        filters: action.payload
      };
    }
    case fromTimelineActivityActions.LOADING_ACTIVITY_SUCCESS: {
      const viewModels = TimelineActivityMapper.mapFromResponse(action.payload);
      for (const viewModel of viewModels) {
        try {
          viewModel.IsVisible = state.filters.find(x => x.Value === viewModel.Type).IsEnabled;
        } catch {
          // This should never error but I added it just in case
        }
      }
      return {
        ...adapter.addMany(viewModels, state),
        loading: false,
        currentPage: action.payload.CurrentPage,
        hasMoreData: action.payload.HasMoreDataToReturn
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

      const newFilters = [];
      for (const filter of state.filters) {
        if (filter.Value === action.payload) {
          newFilters.push({
            ...filter,
            IsEnabled: !filter.IsEnabled
          });
        } else {
          newFilters.push({
            ...filter
          });
        }
      }

      const updatedEntities =  {...state.entities};
      for (const id of state.ids) {
        if (updatedEntities[id].Type === action.payload) {
          updatedEntities[id] = {
            ...updatedEntities[id],
            IsVisible: !updatedEntities[id].IsVisible
          };
        }
      }

      return {
        ...state,
        filters: newFilters,
        entities: updatedEntities
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
export const getFilters = (state: State) => state.filters;
export const getGetCurrentPage = (state: State) => state.currentPage;
export const getHasMoreData = (state: State) => state.hasMoreData;
