import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromUdfManagerReducer from './udf-manager.reducer';

// Feature area state
export interface SurveyUdfManagerState {
  udfManager: fromUdfManagerReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  surveyUdfManager: SurveyUdfManagerState;
}

// Feature area reducers
export const reducers = {
  udfManager: fromUdfManagerReducer.reducer,
};

// Select Feature Area
export const selectSurveyUdfManagerState =
  createFeatureSelector<SurveyUdfManagerState>('surveyUdfManager');

// View Selectors
export const selectUdfManagerState =
  createSelector(selectSurveyUdfManagerState, (state: SurveyUdfManagerState) => state.udfManager);

// Udf Manager Companies
export const getCompaniesList = createSelector(
  selectUdfManagerState, fromUdfManagerReducer.getCompaniesList
);

export const getCompaniesListLoading = createSelector(
  selectUdfManagerState, fromUdfManagerReducer.getCompaniesLoading
);

export const getCompaniesListLoadingError = createSelector(
  selectUdfManagerState, fromUdfManagerReducer.getCompaniesLoadingError
);

export const getSelectedCompany = createSelector(
  selectUdfManagerState, fromUdfManagerReducer.getSelectedCompany
);

export const getUdfSettings = createSelector(
  selectUdfManagerState, fromUdfManagerReducer.getUdfSettings
);

export const getUdfSettingsLoading = createSelector(
  selectUdfManagerState, fromUdfManagerReducer.getUdfsLoading
);

export const getUdfSettingsLoadingError = createSelector(
  selectUdfManagerState, fromUdfManagerReducer.getUdfsLoadingError
);

export const getPayElements = createSelector(
  selectUdfManagerState, fromUdfManagerReducer.getPayElements
);

export const getConfirmSave = createSelector(
  selectUdfManagerState, fromUdfManagerReducer.getConfirmSave
);

export const getSavingUdfsError = createSelector(
  selectUdfManagerState, fromUdfManagerReducer.getSavingUdfsError
);

export const getSavingUdfsErrorMessage = createSelector(
  selectUdfManagerState, fromUdfManagerReducer.getSavingUdfsErrorMessage
);
