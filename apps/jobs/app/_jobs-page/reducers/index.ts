import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromJobsPageReducer from './jobs-page.reducer';
import * as fromJobDescriptionReducer from './job-description.reducer';
import * as fromJobPeerMatchesReducer from './peer-matches-exchange.reducer';

// Feature area state
export interface JobsPageStateMain {
  jobsPage: fromJobsPageReducer.State;
  jobDescription: fromJobDescriptionReducer.State;
  peerMatches: fromJobPeerMatchesReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  jobsPage: JobsPageStateMain;
}

// Feature area reducers
export const reducers = {
  jobsPage: fromJobsPageReducer.reducer,
  jobDescription: fromJobDescriptionReducer.reducer,
  peerMatches: fromJobPeerMatchesReducer.reducer
};

// Select Feature Area
export const selectJobsPageMainState =
  createFeatureSelector<JobsPageStateMain>('jobsPageMain');

// Jobs Page Selectors
export const selectJobsPageState =
  createSelector(selectJobsPageMainState, (state: JobsPageStateMain) => state.jobsPage);

export const getJobsPageId = createSelector(selectJobsPageState, fromJobsPageReducer.getJobsPageId);
export const getCreatingProject = createSelector(selectJobsPageState, fromJobsPageReducer.getCreatingProject);
export const getChangingJobStatus = createSelector(selectJobsPageState, fromJobsPageReducer.getChangingJobStatus);
export const getDeletingJob = createSelector(selectJobsPageState, fromJobsPageReducer.getDeletingJob);
export const getDeletingPricing = createSelector(selectJobsPageState, fromJobsPageReducer.getDeletingPricing);
export const getDeletingPricingMatch = createSelector(selectJobsPageState, fromJobsPageReducer.getDeletingPricingMatch);
export const getStructureGradeNames = createSelector(selectJobsPageState, fromJobsPageReducer.getStructureGradeNames);
export const getCompanyPayMarkets = createSelector(selectJobsPageState, fromJobsPageReducer.getCompanyPayMarkets);
export const getPricingDetailsView = createSelector(selectJobsPageState, fromJobsPageReducer.getPricingDetailsView);
export const getExportOptions = createSelector(selectJobsPageState, fromJobsPageReducer.getExportOptions);
export const getNavigatingToOldPage = createSelector(selectJobsPageState, fromJobsPageReducer.getNavigatingToOldPage);

// Job Description Selectors
export const selectJobDescriptionState =
  createSelector(selectJobsPageMainState, (state: JobsPageStateMain) => state.jobDescription);

  export const getJobId = createSelector(selectJobDescriptionState, fromJobDescriptionReducer.getJobId);
  export const getLoading = createSelector(selectJobDescriptionState, fromJobDescriptionReducer.getLoading);
  export const getJobDescriptionSummary = createSelector(selectJobDescriptionState, fromJobDescriptionReducer.getJobDescriptionSummary);
  export const getUpdatedJobDescription = createSelector(selectJobDescriptionState, fromJobDescriptionReducer.getUpdatedJobDescription);

// Job Peer Matches
export const selectJobPeerMatchesState =
  createSelector(selectJobsPageMainState, (state: JobsPageStateMain) => state.peerMatches);

export const getPeerMatchesLoaded = createSelector(selectJobPeerMatchesState, fromJobPeerMatchesReducer.getPeerMatchesLoaded);
export const getPeerMatches = createSelector(selectJobPeerMatchesState, fromJobPeerMatchesReducer.getPeerMatches);
