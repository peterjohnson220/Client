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

// Grid constants
export const DEFAULT_PAGING_OPTIONS = fromPfDataGridReducer.DEFAULT_PAGING_OPTIONS;

// Grid selectors
export const getState = createSelector(selectPfDataGridState, fromPfDataGridReducer.getState);
export const getGrid = createSelector(selectPfDataGridState, fromPfDataGridReducer.getGrid);
export const getLoading = createSelector(selectPfDataGridState, fromPfDataGridReducer.getLoading);
export const getBaseEntity = createSelector(selectPfDataGridState, fromPfDataGridReducer.getBaseEntity);
export const getFields = createSelector(selectPfDataGridState, fromPfDataGridReducer.getFields);
export const getGroupedFields = createSelector(selectPfDataGridState, fromPfDataGridReducer.getGroupedFields);
export const getGlobalFilters = createSelector(selectPfDataGridState, fromPfDataGridReducer.getGlobalFilters);
export const getPagingOptions = createSelector(selectPfDataGridState, fromPfDataGridReducer.getPagingOptions);
export const getData = createSelector(selectPfDataGridState, fromPfDataGridReducer.getData);
export const getInboundFilters = createSelector(selectPfDataGridState, fromPfDataGridReducer.getInboundFilters);
export const getFilters = createSelector(selectPfDataGridState, fromPfDataGridReducer.getFilters);
export const getFilterPanelDisplay = createSelector(selectPfDataGridState, fromPfDataGridReducer.getFilterPanelDisplay);
export const getSelectedRowId = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSelectedRowId);
export const getSplitViewFilters = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSplitViewFilters);
