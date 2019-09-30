import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromPfDataGridReducer from './pf-data-grid.reducer';

// Feature area state
export interface LibsPfDataGridState {
  grids: fromPfDataGridReducer.DataGridStoreState;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  pfDataGrids: LibsPfDataGridState;
}

// Feature area reducers
export const reducers = {
  grids: fromPfDataGridReducer.reducer
};

// Select Feature Area
export const selectFeatureState =
  createFeatureSelector<LibsPfDataGridState>('pfDataGrids');

// View Selectors
export const selectPfDataGridState =
  createSelector(selectFeatureState, (state: LibsPfDataGridState) => state.grids);

// Grid selectors
export const getState = createSelector(selectPfDataGridState, fromPfDataGridReducer.getState);
export const getGrid = createSelector(selectPfDataGridState, fromPfDataGridReducer.getGrid);
export const getLoading = createSelector(selectPfDataGridState, fromPfDataGridReducer.getLoading);
export const getBaseEntityId = createSelector(selectPfDataGridState, fromPfDataGridReducer.getBaseEntityId);
export const getFields = createSelector(selectPfDataGridState, fromPfDataGridReducer.getFields);
export const getPageSize = createSelector(selectPfDataGridState, fromPfDataGridReducer.getPageSize);
export const getTotal = createSelector(selectPfDataGridState, fromPfDataGridReducer.getTotal);
export const getSkip = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSkip);
export const getData = createSelector(selectPfDataGridState, fromPfDataGridReducer.getData);
export const getGridData = createSelector(selectPfDataGridState, fromPfDataGridReducer.getGridData);
