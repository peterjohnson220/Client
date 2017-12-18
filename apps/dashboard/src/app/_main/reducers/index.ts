import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromTileGridReducer from './tile-grid.reducer';

// Feature area state
export interface DashboardMainState {
  tileGrid: fromTileGridReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  dashboardMain: DashboardMainState;
}

// Feature area reducers
export const reducers = {
  tileGrid: fromTileGridReducer.reducer
};

// Select Feature Area
export const selectDashboardMainState = createFeatureSelector<DashboardMainState>('dashboardMain');

// Feature Selectors
export const selectTileGridState = createSelector(selectDashboardMainState, (state: DashboardMainState) => state.tileGrid);

// Entity Adapter Selectors
export const {
  selectAll: getTileGridTiles,
} = fromTileGridReducer.adapter.getSelectors(selectTileGridState);

export const getTileGridLoading = createSelector(selectTileGridState, fromTileGridReducer.getLoading);
export const getTileGridLoadingError = createSelector(selectTileGridState, fromTileGridReducer.getLoadingError);
