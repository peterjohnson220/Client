import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromLoaderDashboardPageReducer from './loader-dashboard-page.reducer';

// Feature area state
export interface LoaderDashboardMainState {
  loaderDashboardPage: fromLoaderDashboardPageReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  loaderdashboard_main: LoaderDashboardMainState;
}

// Feature area reducers
export const reducers = {
  loaderDashboardPage: fromLoaderDashboardPageReducer.reducer
};

// Select Feature area
export const selectFeatureAreaState = createFeatureSelector<LoaderDashboardMainState>('loaderdashboard_main');

// Feature Selectors
export const selectLoaderDashboardPageState = createSelector(
  selectFeatureAreaState,
  (state: LoaderDashboardMainState) => state.loaderDashboardPage
);

// Loader Dashboard Page
export const getCompositeLoadsObj = createSelector(
  selectLoaderDashboardPageState,
  fromLoaderDashboardPageReducer.getCompositeLoadsObj
);
export const getCompositeLoadsResult = createSelector(
  selectLoaderDashboardPageState,
  fromLoaderDashboardPageReducer.getCompositeLoadsResult
);
export const getGridSearchPayload = createSelector(
  selectLoaderDashboardPageState,
  fromLoaderDashboardPageReducer.getGridSearchPayload
);
