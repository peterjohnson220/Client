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
export const getSelectableFields = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSelectableFields);
export const getGroupedFields = createSelector(selectPfDataGridState, fromPfDataGridReducer.getGroupedFields);
export const getGlobalFilters = createSelector(selectPfDataGridState, fromPfDataGridReducer.getGlobalFilters);
export const getFilterableFields = createSelector(selectPfDataGridState, fromPfDataGridReducer.getFilterableFields);
export const getPagingOptions = createSelector(selectPfDataGridState, fromPfDataGridReducer.getPagingOptions);
export const getDefaultSortDescriptor = createSelector(selectPfDataGridState, fromPfDataGridReducer.getDefaultSortDescriptor);
export const getSortDescriptor = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSortDescriptor);
export const getData = createSelector(selectPfDataGridState, fromPfDataGridReducer.getData);
export const getApplyDefaultFilters = createSelector(selectPfDataGridState, fromPfDataGridReducer.getApplyDefaultFilters);
export const getInboundFilters = createSelector(selectPfDataGridState, fromPfDataGridReducer.getInboundFilters);
export const getFilterPanelDisplay = createSelector(selectPfDataGridState, fromPfDataGridReducer.getFilterPanelDisplay);
export const getSelectedRecordId = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSelectedRecordId);
export const getExpandedRows = createSelector(selectPfDataGridState, fromPfDataGridReducer.getExpandedRows);
export const getSplitViewFilters = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSplitViewFilters);
export const getSelectedKeys = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSelectedKeys);
export const getSelectAllState = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSelectAllState);
export const getSavedViews = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSavedViews);
export const getSaveViewModalOpen = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSaveViewModalOpen);
export const getViewIsSaving = createSelector(selectPfDataGridState, fromPfDataGridReducer.getViewIsSaving);
export const getViewIsDeleting = createSelector(selectPfDataGridState, fromPfDataGridReducer.getViewIsDeleting);
export const getViewNameToBeDeleted = createSelector(selectPfDataGridState, fromPfDataGridReducer.getViewNameToBeDeleted);
