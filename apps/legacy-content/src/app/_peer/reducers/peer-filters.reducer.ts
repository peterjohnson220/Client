import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as fromPeerFilterActions from '../actions/peer-filters.actions';

// Extended entity state
export interface State extends EntityState<any> {
  loading: boolean;
  loadingError: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<any> = createEntityAdapter<any>({
  selectId: (filter: any) => filter.Id
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
      const filters: any[] = action.payload;
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
