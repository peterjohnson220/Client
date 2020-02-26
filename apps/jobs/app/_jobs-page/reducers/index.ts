import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromJobsPageReducer from './jobs-page.reducer';
import * as fromJobDescriptionReducer from './job-description.reducer';

// Feature area state
export interface JobsPageStateMain {
  jobsPage: fromJobsPageReducer.State;
  jobDescription: fromJobDescriptionReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  jobsPage: JobsPageStateMain;
}

// Feature area reducers
export const reducers = {
  jobsPage: fromJobsPageReducer.reducer,
  jobDescription: fromJobDescriptionReducer.reducer
};

// Select Feature Area
export const selectJobsPageMainState =
  createFeatureSelector<JobsPageStateMain>('jobsPageMain');

// Jobs Page Selectors
export const selectJobsPageState =
  createSelector(selectJobsPageMainState, (state: JobsPageStateMain) => state.jobsPage);

export const getCompany = createSelector(selectJobsPageState, fromJobsPageReducer.getCompany);
export const getJobsPageId = createSelector(selectJobsPageState, fromJobsPageReducer.getJobsPageId);
export const getShowAddToProjectModal = createSelector(selectJobsPageState, fromJobsPageReducer.getShowAddToProjectModal);
export const getAddingToProject = createSelector(selectJobsPageState, fromJobsPageReducer.getAddingToProject);
export const getShowJobStatusModal = createSelector(selectJobsPageState, fromJobsPageReducer.getShowJobStatusModal);
export const getChangingJobStatus = createSelector(selectJobsPageState, fromJobsPageReducer.getChangingJobStatus);

// Job Description Selectors
export const selectJobDescriptionState =
  createSelector(selectJobsPageMainState, (state: JobsPageStateMain) => state.jobDescription);

export const getJobDescription = createSelector(selectJobDescriptionState, fromJobDescriptionReducer.getJobDescription);
export const getJobDescriptionManagementEnabled = createSelector(selectJobDescriptionState, fromJobDescriptionReducer.getJobDescriptionManagementEnabled);
export const getJobDescriptionUpdated = createSelector(selectJobDescriptionState, fromJobDescriptionReducer.getJobDescriptionUpdated);
export const getSavingState = createSelector(selectJobDescriptionState, fromJobDescriptionReducer.getSavingState);
export const getJobDescriptionLoaded = createSelector(selectJobDescriptionState, fromJobDescriptionReducer.getJobDescriptionLoaded);
export const getPricingIdToBeDeleted = createSelector(selectJobsPageState, fromJobsPageReducer.getPricingIdToBeDeleted);
export const getCompanyPayMarkets = createSelector(selectJobsPageState, fromJobsPageReducer.getCompanyPayMarkets);
export const getJobDescriptionId = createSelector(selectJobDescriptionState, fromJobDescriptionReducer.getJobDescriptionId);



