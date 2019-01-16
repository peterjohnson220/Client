import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromJobsPageReducer from './jobs-page.reducer';

// Feature area state
export interface ComphubMainState {
  jobsPage: fromJobsPageReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  comphub_main: ComphubMainState;
}

// Feature area reducers
export const reducers = {
  jobsPage: fromJobsPageReducer.reducer,
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<ComphubMainState>('comphub_main');

// Feature Selectors
export const selectJobsPageState = createSelector(
  selectFeatureAreaState,
  (state: ComphubMainState) => state.jobsPage
);

// Jobs Page
export const getTrendingJobs = createSelector(
  selectJobsPageState,
  fromJobsPageReducer.getTrendingJobs
);

export const getLoadingTrendingJobs = createSelector(
  selectJobsPageState,
  fromJobsPageReducer.getLoadingTrendingJobs
);

export const getLoadingTrendingJobsError = createSelector(
  selectJobsPageState,
  fromJobsPageReducer.getLoadingTrendingJobsError
);
