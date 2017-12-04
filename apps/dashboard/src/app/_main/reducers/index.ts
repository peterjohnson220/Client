import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromDashboardReducer from './dashboard.reducer';

// Feature area state
export interface DashboardState {
  tiles: fromDashboardReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  dashboard: DashboardState;
}

// Feature area reducers
export const reducers = {
  tiles: fromDashboardReducer.reducer
};

// Select Feature Area
export const selectDashboardState = createFeatureSelector<DashboardState>('dashboard');

// Feature Selectors
export const selectTilesState = createSelector(selectDashboardState, (state: DashboardState) => state.tiles);

// Entity Adapter Selectors
export const {
  selectIds: getTilesIds,
  selectEntities: getTilesDictionary,
  selectAll: getTiles,
  selectTotal: getTilesTotal
} = fromDashboardReducer.adapter.getSelectors(selectTilesState);

export const getTilesLoading = createSelector(selectTilesState, fromDashboardReducer.getLoading);
export const getTilesLoadingError = createSelector(selectTilesState, fromDashboardReducer.getLoadingError);


