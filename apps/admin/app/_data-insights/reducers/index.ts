import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromStandardReportsListPageReducer from './standard-reports-list-page.reducer';

// Feature area state
export interface DataInsightsManagementMainState {
  standardReportsListPage: fromStandardReportsListPageReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  dataInsights_main: DataInsightsManagementMainState;
}

// Feature area reducers
export const reducers = {
  standardReportsListPage: fromStandardReportsListPageReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<DataInsightsManagementMainState>('dataInsightsManagement_main');

// Feature Selectors
export const selectStandardReportsListPageState = createSelector(
  selectFeatureAreaState,
  (state: DataInsightsManagementMainState) => state.standardReportsListPage
);

// Data Insights Management List Page
export const getStandardReportDetailsAsync = createSelector(
  selectStandardReportsListPageState,
  fromStandardReportsListPageReducer.getStandardReportDetails
);

export const getSyncingStandardReports = createSelector(
  selectStandardReportsListPageState,
  fromStandardReportsListPageReducer.getSyncingStandardReports
);

