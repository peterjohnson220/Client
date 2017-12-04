import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { DashboardTile } from 'libs/models';

import * as fromDashboardActions from '../actions/dashboard.actions';

export interface State extends EntityState<DashboardTile> {
  loading: boolean;
  loadingError: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<DashboardTile> = createEntityAdapter<DashboardTile>({
  selectId: (dashboardTile: DashboardTile) => dashboardTile.TileId
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
      case fromDashboardActions.LOADING_TILES: {
        return {
          ...state,
          loading: true,
          loadingError: false
        };
      }
      case fromDashboardActions.LOADING_TILES_SUCCESS: {
        return {
          ...adapter.addAll(action.payload, state),
          loading: false
        };
      }
      case fromDashboardActions.LOADING_TILES_ERROR: {
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
