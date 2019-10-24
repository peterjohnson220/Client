import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromJobsPageReducer from './jobs-page.reducer';

// Feature area state
export interface JobsPageStateMain {
  jobsPage: fromJobsPageReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  jobsPage: JobsPageStateMain;
}

// Feature area reducers
export const reducers = {
  jobsPage: fromJobsPageReducer.reducer
};

// Select Feature Area
export const selectJobsPageMainState =
  createFeatureSelector<JobsPageStateMain>('jobsPageMain');

// Jobs Page Selectors
export const selectJobsPageState =
  createSelector(selectJobsPageMainState, (state: JobsPageStateMain) => state.jobsPage);

export const getCompany = createSelector(selectJobsPageState, fromJobsPageReducer.getCompany);
export const getCompanyLoading = createSelector(selectJobsPageState, fromJobsPageReducer.getloading);
export const getCompanyLoadingError = createSelector(selectJobsPageState, fromJobsPageReducer.getloadingError);
export const getToProjectButtonState = createSelector(selectJobsPageState, fromJobsPageReducer.getToProjectButtonState);
