import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as fromPeerFilterActions from '../actions/peer-filters.actions';
import { FilterAggregateGroup } from 'libs/models/peer/aggregate-filters';

// Extended entity state
export interface State extends EntityState<FilterAggregateGroup> {
  loading: boolean;
  loadingError: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<FilterAggregateGroup> = createEntityAdapter<FilterAggregateGroup>({
  selectId: (filter: FilterAggregateGroup) => filter.MetaData.FilterType
});

// Initial State
export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false
});

// Reducer
export function reducer(state = initialState, action: fromPeerFilterActions.Actions): State {
  switch (action.type) {
    case fromPeerFilterActions.LOADING_PEER_FILTERS: {
      return {
        ...adapter.removeAll(state),
        loading: true
      };
    }
    case fromPeerFilterActions.LOADING_PEER_FILTERS_SUCCESS: {
      const filters: FilterAggregateGroup[] = action.payload;
      return {
        ...adapter.addAll(filters, state),
        loading: false
      };
    }
    case fromPeerFilterActions.LOADING_PEER_FILTERS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
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
