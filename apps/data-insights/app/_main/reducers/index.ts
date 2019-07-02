import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromDataInsightsPageReducer from './data-insights-page.reducer';
import * as fromDashboardsReducer from './dashboards.reducer';

// Feature area state
export interface DataInsightsMainState {
  dataInsightsPage: fromDataInsightsPageReducer.State;
  dashboards: fromDashboardsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  dataInsights_main: DataInsightsMainState;
}

// Feature area reducers
export const reducers = {
  dataInsightsPage: fromDataInsightsPageReducer.reducer,
  dashboards: fromDashboardsReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<DataInsightsMainState>('dataInsights_main');

// Feature Selectors
export const selectDataInsightsPageState = createSelector(
  selectFeatureAreaState,
  (state: DataInsightsMainState) => state.dataInsightsPage
);

export const selectDashboardsState = createSelector(
  selectFeatureAreaState,
  (state: DataInsightsMainState) => state.dashboards
);

// Data Insights Page
export const getStandardReportsAsync = createSelector(
  selectDataInsightsPageState,
  fromDataInsightsPageReducer.getStandardReportsAsync
);

// Dashboards
export const getCompanyWorkbooksAsync = createSelector(
  selectDashboardsState,
  fromDashboardsReducer.getCompanyWorkbooksAsync
);

export const getDashboardView = createSelector(
  selectDashboardsState,
  fromDashboardsReducer.getDashboardView
);

export const getFilteredCompanyWorkbooks = createSelector(
  selectDashboardsState,
  fromDashboardsReducer.getFilteredCompanyWorkbooks
);
