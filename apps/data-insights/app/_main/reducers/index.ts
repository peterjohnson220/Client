import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromDataInsightsPageReducer from './data-insights-page.reducer';
import * as fromAllDashboardsReducer from './dashboards.reducer';

// Feature area state
export interface DataInsightsMainState {
  dataInsightsPage: fromDataInsightsPageReducer.State;
  dashboards: fromAllDashboardsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  dataInsights_main: DataInsightsMainState;
}

// Feature area reducers
export const reducers = {
  dataInsightsPage: fromDataInsightsPageReducer.reducer,
  dashboards: fromAllDashboardsReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<DataInsightsMainState>('dataInsights_main');

// Feature Selectors
export const selectDataInsightsPageState = createSelector(
  selectFeatureAreaState,
  (state: DataInsightsMainState) => state.dataInsightsPage
);

export const selectAllDashboardsState = createSelector(
  selectFeatureAreaState,
  (state: DataInsightsMainState) => state.dashboards
);

// Data Insights Page
export const getStandardReportsAsync = createSelector(
  selectDataInsightsPageState,
  fromDataInsightsPageReducer.getStandardReportsAsync
);

// Dashboards
export const getLoadingCompanyReports = createSelector(
  selectAllDashboardsState,
  fromAllDashboardsReducer.getLoadingCompanyReports
);

export const getLoadingCompanyReportsSuccess = createSelector(
  selectAllDashboardsState,
  fromAllDashboardsReducer.getLoadingCompanyReportsSuccess
);

export const getLoadingCompanyReportsError = createSelector(
  selectAllDashboardsState,
  fromAllDashboardsReducer.getLoadingCompanyReportsError
);

export const getCompanyReports = createSelector(
  selectAllDashboardsState,
  fromAllDashboardsReducer.getCompanyReports
);
