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
export const getLinkGroups = createSelector(selectPfDataGridState, fromPfDataGridReducer.getLinkGroups);
export const getSelectionField = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSelectionField);
export const getFieldsExcludedForExport = createSelector(selectPfDataGridState, fromPfDataGridReducer.getFieldsExcludedForExport);
export const getPrimaryKey = createSelector(selectPfDataGridState, fromPfDataGridReducer.getPrimaryKey);
export const getFields = createSelector(selectPfDataGridState, fromPfDataGridReducer.getFields);
export const getVisibleOrderedFields  = createSelector(selectPfDataGridState, fromPfDataGridReducer.getVisibleOrderedFields);
export const getSelectableFields = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSelectableFields);
export const getGroupedFields = createSelector(selectPfDataGridState, fromPfDataGridReducer.getGroupedFields);
export const getGlobalFilters = createSelector(selectPfDataGridState, fromPfDataGridReducer.getGlobalFilters);
export const getFilterableFields = createSelector(selectPfDataGridState, fromPfDataGridReducer.getFilterableFields);
export const getPagingOptions = createSelector(selectPfDataGridState, fromPfDataGridReducer.getPagingOptions);
export const getDefaultSortDescriptor = createSelector(selectPfDataGridState, fromPfDataGridReducer.getDefaultSortDescriptor);
export const getSortDescriptor = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSortDescriptor);
export const getSaveSort = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSaveSort);
export const getPreserveSelectionsOnGetConfig = createSelector(selectPfDataGridState, fromPfDataGridReducer.getPreserveSelectionsOnGetConfig);
export const getData = createSelector(selectPfDataGridState, fromPfDataGridReducer.getData);
export const getApplyDefaultFilters = createSelector(selectPfDataGridState, fromPfDataGridReducer.getApplyDefaultFilters);
export const getApplyUserDefaultCompensationFields = createSelector(selectPfDataGridState, fromPfDataGridReducer.getApplyUserDefaultCompensationFields);
export const getUseReportingDB = createSelector(selectPfDataGridState, fromPfDataGridReducer.getUseReportingDB);
export const getInboundFilters = createSelector(selectPfDataGridState, fromPfDataGridReducer.getInboundFilters);
export const getFilterPanelDisplay = createSelector(selectPfDataGridState, fromPfDataGridReducer.getFilterPanelDisplay);
export const getSelectedRecordId = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSelectedRecordId);
export const getSelectedRow = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSelectedRow);
export const getExpandedRows = createSelector(selectPfDataGridState, fromPfDataGridReducer.getExpandedRows);
export const getSplitViewFilters = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSplitViewFilters);
export const getSelectedKeys = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSelectedKeys);
export const getSelectedData = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSelectedData);
export const getSelectAllState = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSelectAllState);
export const getSavedViews = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSavedViews);
export const getSaveViewModalOpen = createSelector(selectPfDataGridState, fromPfDataGridReducer.getSaveViewModalOpen);
export const getViewIsSaving = createSelector(selectPfDataGridState, fromPfDataGridReducer.getViewIsSaving);
export const getViewIsDeleting = createSelector(selectPfDataGridState, fromPfDataGridReducer.getViewIsDeleting);
export const getExportEventId = createSelector(selectPfDataGridState, fromPfDataGridReducer.getExportEventId);
export const getExportingGrid = createSelector(selectPfDataGridState, fromPfDataGridReducer.getExportingGrid);
export const getExportViewId = createSelector(selectPfDataGridState, fromPfDataGridReducer.getExportViewId);
export const getLoadingExportingStatus = createSelector(selectPfDataGridState, fromPfDataGridReducer.getLoadingExportingStatus);
export const getFieldsFilterCount = createSelector(selectPfDataGridState, fromPfDataGridReducer.getFieldsFilterCount);
export const getGridConfig = createSelector(selectPfDataGridState, fromPfDataGridReducer.getGridConfig);
export const getFilterPanelOpen = createSelector(selectPfDataGridState, fromPfDataGridReducer.getFilterPanelOpen);
export const getModifiedKeys = createSelector(selectPfDataGridState, fromPfDataGridReducer.getModifiedKeys);
export const getGridScrolledContent = createSelector(selectPfDataGridState, fromPfDataGridReducer.getGridScrolledContent);
export const getTotalCount = createSelector(selectPfDataGridState, fromPfDataGridReducer.getTotalCount);
export const getHasMoreDataOnServer = createSelector(selectPfDataGridState, fromPfDataGridReducer.getHasMoreDataOnServer);
export const getLoadingMoreData = createSelector(selectPfDataGridState, fromPfDataGridReducer.getLoadingMoreData);
export const getLastUpdateFieldsDate = createSelector(selectPfDataGridState, fromPfDataGridReducer.getLastUpdateFieldsDate);
export const getVisibleKeys = createSelector(selectPfDataGridState, fromPfDataGridReducer.getVisibleKeys);
export const getUnexpectedError = createSelector(selectPfDataGridState, fromPfDataGridReducer.getUnexpectedError);
export const getFadeInKeys = createSelector(selectPfDataGridState, fromPfDataGridReducer.getFadeInKeys);
