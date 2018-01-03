import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { Feature } from '../models';

import * as fromDashboardActions from '../actions/dashboard.actions';

export interface State extends EntityState<Feature> {
  loading: boolean;
  loadingError: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<Feature> = createEntityAdapter<Feature>({
  selectId: (feature: Feature) => feature.type
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false
});

// Reducer
export function reducer(
  state = initialState,
  action: fromDashboardActions.Actions
): State {
    switch (action.type) {
      case fromDashboardActions.LOADING_FEATURES: {
        return {
          ...state,
          loading: true,
          loadingError: false
        };
      }
      case fromDashboardActions.LOADING_FEATURES_SUCCESS: {
        return {
          ...adapter.addAll(action.payload, state),
          loading: false
        };
      }
      case fromDashboardActions.LOADING_FEATURES_ERROR: {
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

// Selector functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
