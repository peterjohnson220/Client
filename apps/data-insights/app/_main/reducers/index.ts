import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromAllDashboardsReducer from './all-dashboards.reducer';

// Feature area state
export interface DataInsightsMainState {
  allDashboards: fromAllDashboardsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  datainsights_main: DataInsightsMainState;
}

// Feature area reducers
export const reducers = {
  allDashboards: fromAllDashboardsReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<DataInsightsMainState>('datainsights_main');

// Feature Selectors
export const selectAllDashboardsState = createSelector(
  selectFeatureAreaState,
  (state: DataInsightsMainState) => state.allDashboards
);

// All Dashboards
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
