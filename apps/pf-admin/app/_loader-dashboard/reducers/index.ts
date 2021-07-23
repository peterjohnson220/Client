import { createFeatureSelector, createSelector } from '@ngrx/store';

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
export const getFilePackagesObj = createSelector(
  selectLoaderDashboardPageState,
  fromLoaderDashboardPageReducer.getFilePackagesObj
);
export const getFilePackagesResult = createSelector(
  selectLoaderDashboardPageState,
  fromLoaderDashboardPageReducer.getFilePackagesResult
);
export const getRedropExportedSourceFile = createSelector(
  selectLoaderDashboardPageState,
  fromLoaderDashboardPageReducer.getRedropExportedSourceFile
);
export const getRedropConfirmationModalOpen = createSelector(
  selectLoaderDashboardPageState,
  fromLoaderDashboardPageReducer.getRedropConfirmationModalOpen
);
export const getUpdatedArchiveSummaryObj = createSelector(
  selectLoaderDashboardPageState,
  fromLoaderDashboardPageReducer.getUpdatedArchiveSummaryObj
);
export const getRedropFileObj = createSelector(
  selectLoaderDashboardPageState,
  fromLoaderDashboardPageReducer.getRedropFileObj
);
export const getIsModifiedRedropInProgress = createSelector(
  selectLoaderDashboardPageState,
  fromLoaderDashboardPageReducer.getIsModifiedRedropInProgress
);
export const getRedropExportedSourceFileToNewDataLoad = createSelector(
  selectLoaderDashboardPageState,
  fromLoaderDashboardPageReducer.getRedropExportedSourceFileToNewDataLoad
);
export const getRedropNewDataLoadConfirmationModalOpen = createSelector(
  selectLoaderDashboardPageState,
  fromLoaderDashboardPageReducer.getRedropNewDataLoadConfirmationModalOpen
);
