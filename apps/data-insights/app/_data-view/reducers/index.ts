import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromDataViewReducer from './data-view.reducer';
import * as fromDataViewGridReducer from './data-view-grid.reducer';
import * as fromFiltersReducer from './filters.reducer';
import * as fromFieldsReducer from './fields.reducer';
import * as fromFormulaFieldReducer from './formula-field.reducer';

// Feature area state
export interface DataViewMainState {
  formulaField: fromFormulaFieldReducer.State;
  dataView: fromDataViewReducer.State;
  dataViewGrid: fromDataViewGridReducer.State;
  filters: fromFiltersReducer.State;
  fields: fromFieldsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  dataView_main: DataViewMainState;
}

// Feature area reducers
export const reducers = {
  formulaField: fromFormulaFieldReducer.reducer,
  dataView: fromDataViewReducer.reducer,
  dataViewGrid: fromDataViewGridReducer.reducer,
  filters: fromFiltersReducer.reducer,
  fields: fromFieldsReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<DataViewMainState>('dataView_main');

// Feature Selectors
export const selectFormulaFieldState = createSelector(
  selectFeatureAreaState,
  (state: DataViewMainState) => state.formulaField
);

export const selectDataViewState = createSelector(
  selectFeatureAreaState,
  (state: DataViewMainState) => state.dataView
);

export const selectDataViewGridState = createSelector(
  selectFeatureAreaState,
  (state: DataViewMainState) => state.dataViewGrid
);

export const selectFiltersState = createSelector(
  selectFeatureAreaState,
  (state: DataViewMainState) => state.filters
);

export const selectFieldsState = createSelector(
  selectFeatureAreaState,
  (state: DataViewMainState) => state.fields
);

// Data View
export const getExportingUserReport = createSelector(
  selectDataViewState,
  fromDataViewReducer.getExportingUserReport
);

export const getExportEventId = createSelector(
  selectDataViewState,
  fromDataViewReducer.getExportEventId
);

export const getUserDataViewAsync = createSelector(
  selectDataViewState,
  fromDataViewReducer.getUserDataViewAsync
);

export const getShareableUsersAsync = createSelector(
  selectDataViewState,
  fromDataViewReducer.getShareableUsersAsync
);

export const getSharedUserPermissionsAsync = createSelector(
  selectDataViewState,
  fromDataViewReducer.getSharedUserPermissionsAsync
);

export const getSharedUserPermissionsLoaded = createSelector(
  selectDataViewState,
  fromDataViewReducer.getSharedUserPermissionsLoaded
);

export const getLoadingErrorMessage = createSelector(
  selectDataViewState,
  fromDataViewReducer.getLoadingErrorMessage
);

export const getEditingUserReport = createSelector(
  selectDataViewState,
  fromDataViewReducer.getEditingUserReport
);

export const getEditUserReportSuccess = createSelector(
  selectDataViewState,
  fromDataViewReducer.getEditUserReportSuccess
);

export const getEditUserReportError = createSelector(
  selectDataViewState,
  fromDataViewReducer.getEditUserReportError
);

export const getEditUserReportConflict = createSelector(
  selectDataViewState,
  fromDataViewReducer.getEditUserReportConflict
);

export const getDuplicatingUserReport = createSelector(
  selectDataViewState,
  fromDataViewReducer.getDuplicatingUserReport
);

export const getDuplicateUserReportError = createSelector(
  selectDataViewState,
  fromDataViewReducer.getDuplicateUserReportError
);

export const getDuplicateUserReportConflict = createSelector(
  selectDataViewState,
  fromDataViewReducer.getDuplicateUserReportConflict
);

export const getDuplicateUserReportSuccess = createSelector(
  selectDataViewState,
  fromDataViewReducer.getDuplicateUserReportSuccess
);

// Data View Grid
export const getReportDataAsync = createSelector(
  selectDataViewGridState,
  fromDataViewGridReducer.getReportDataAsync
);

export const getPagingOptions = createSelector(
  selectDataViewGridState,
  fromDataViewGridReducer.getPagingOptions
);

export const getLoadingMoreData = createSelector(
  selectDataViewGridState,
  fromDataViewGridReducer.getLoadingMoreData
);

export const getHasMoreDataOnServer = createSelector(
  selectDataViewGridState,
  fromDataViewGridReducer.getHasMoreDataOnServer
);

export const getSortDescriptor = createSelector(
  selectDataViewGridState,
  fromDataViewGridReducer.getSortDescriptor
);

export const getTotalCountAsync = createSelector(
  selectDataViewGridState,
  fromDataViewGridReducer.getTotalCountAsync
);

// Configure Filters
export const getActiveFilters = createSelector(
  selectFiltersState,
  fromFiltersReducer.getActiveFilters
);

export const getActiveFiltersCount = createSelector(
  selectFiltersState,
  fromFiltersReducer.getActiveFiltersCount
);

export const getPendingFiltersValid = createSelector(
  selectFiltersState,
  fromFiltersReducer.getPendingFiltersValid
);

export const getPendingFilters = createSelector(
  selectFiltersState,
  fromFiltersReducer.getPendingFilters
);

// Configure Fields
export const getReportFieldsAsync = createSelector(
  selectFieldsState,
  fromFieldsReducer.getReportFieldsAsync
);

export const getSelectedFields = createSelector(
  selectFieldsState,
  fromFieldsReducer.getSelectedFields
);

export const getUnselectedFields = createSelector(
  selectFieldsState,
  fromFieldsReducer.getUnselectedFields
);

export const getFormulaFieldSuggestions = createSelector(
  selectFieldsState,
  fromFieldsReducer.getFormulaFieldSuggestions
);

export const getUserFormulas = createSelector(
  selectFieldsState,
  fromFieldsReducer.getUserFormulas
);

// Formula Field Modal
export const getFormulaValidating = createSelector(
  selectFormulaFieldState,
  fromFormulaFieldReducer.getValidating
);

export const getFormulaValid = createSelector(
  selectFormulaFieldState,
  fromFormulaFieldReducer.getFormulaValid
);

export const getFormulaSaving = createSelector(
  selectFormulaFieldState,
  fromFormulaFieldReducer.getSaving
);

export const getFormulaSavingSuccess = createSelector(
  selectFormulaFieldState,
  fromFormulaFieldReducer.getSavingSuccess
);

export const getFormulaSavingError = createSelector(
  selectFormulaFieldState,
  fromFormulaFieldReducer.getSavingError
);

export const getFormulaSavingErrorMessage = createSelector(
  selectFormulaFieldState,
  fromFormulaFieldReducer.getSavingErrorMessage
);

export const getFormulaDataType = createSelector(
  selectFormulaFieldState,
  fromFormulaFieldReducer.getFormulaDataType
);

export const getFormulaViewCount = createSelector(
  selectFormulaFieldState,
  fromFormulaFieldReducer.getFormulaViewCount
);
