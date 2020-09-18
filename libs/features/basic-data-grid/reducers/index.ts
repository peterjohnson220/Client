import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromBasicDataGridReducer from './basic-data-grid.reducer';

// Feature area state
export interface BasicDataGridState {
  basicDataGrid: fromBasicDataGridReducer.BasicGridStateStore;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_basic_data_grid: BasicDataGridState;
}

// Feature area reducers
export const reducers = {
  basicDataGrid: fromBasicDataGridReducer.reducer
};

// Select Feature Area
export const selectPayMarketManagementFeature = createFeatureSelector<BasicDataGridState>('feature_basic_data_grid');

// View Selectors
export const selectBasicDataGridState = createSelector(selectPayMarketManagementFeature, (state: BasicDataGridState) => state.basicDataGrid);

// Basic Data Grid
export const getData = createSelector(selectBasicDataGridState, fromBasicDataGridReducer.getData);
export const getBaseEntity = createSelector(selectBasicDataGridState, fromBasicDataGridReducer.getBaseEntity);
export const getFields = createSelector(selectBasicDataGridState, fromBasicDataGridReducer.getFields);
export const getVisibleFields = createSelector(selectBasicDataGridState, fromBasicDataGridReducer.getVisibleFields);
export const getFilters = createSelector(selectBasicDataGridState, fromBasicDataGridReducer.getFilters);
export const getPagingOptions = createSelector(selectBasicDataGridState, fromBasicDataGridReducer.getPagingOptions);
export const getApplyDefaultFilters = createSelector(selectBasicDataGridState, fromBasicDataGridReducer.getApplyDefaultFilters);
export const getDistinct = createSelector(selectBasicDataGridState, fromBasicDataGridReducer.getDistinct);
export const getLoadingMoreData = createSelector(selectBasicDataGridState, fromBasicDataGridReducer.getLoadingMoreData);
export const getHasMoreDataOnServer = createSelector(selectBasicDataGridState, fromBasicDataGridReducer.getHasMoreDataOnServer);
export const getSortDescriptors = createSelector(selectBasicDataGridState, fromBasicDataGridReducer.getSortDescriptors);
export const getTotalCount = createSelector(selectBasicDataGridState, fromBasicDataGridReducer.getTotalCount);
export const getIsInitialized = createSelector(selectBasicDataGridState, fromBasicDataGridReducer.getIsInitialized);
