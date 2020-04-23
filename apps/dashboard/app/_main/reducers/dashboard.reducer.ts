import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { Feature } from '../models';

import * as fromDashboardActions from '../actions/dashboard.actions';

export interface State extends EntityState<Feature> {
  loading: boolean;
  loadingError: boolean;
  accountExecutiveDriftUserId: number;
  gettingDriftUserId: boolean;
  gettingDriftUserIdError: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<Feature> = createEntityAdapter<Feature>({
  selectId: (feature: Feature) => feature.Type
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  accountExecutiveDriftUserId: undefined,
  gettingDriftUserId: false,
  gettingDriftUserIdError: false
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
      case fromDashboardActions.GETTING_DRIFT_USER_ID: {
        return {
          ...state,
          gettingDriftUserId: true
        };
      }
      case fromDashboardActions.GETTING_DRIFT_USER_ID_SUCCESS: {
        return {
          ...state,
          gettingDriftUserId: false,
          accountExecutiveDriftUserId: action.payload
        };
      }
      case fromDashboardActions.GETTING_DRIFT_USER_ID_ERROR: {
        return {
          ...state,
          gettingDriftUserId: false,
          gettingDriftUserIdError: true
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
export const getAccountExecutiveDriftUserId = (state: State) => state.accountExecutiveDriftUserId;
export const getGettingDriftUserId = (state: State) => state.gettingDriftUserId;
export const getGettingDriftUserIdError = (state: State) => state.gettingDriftUserIdError;
