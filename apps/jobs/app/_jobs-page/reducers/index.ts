import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromJobsPageReducer from './jobs-page.reducer';
import * as fromJobDescriptionReducer from './job-description.reducer';
import * as fromJobPeerMatchesReducer from './peer-matches-exchange.reducer';
import * as fromModifyPricingsReducer from './modify-pricings.reducer';

// Feature area state
export interface JobsPageStateMain {
  jobsPage: fromJobsPageReducer.State;
  jobDescription: fromJobDescriptionReducer.State;
  peerMatches: fromJobPeerMatchesReducer.State;
  modifyPricings: fromModifyPricingsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  jobsPage: JobsPageStateMain;
}

// Feature area reducers
export const reducers = {
  jobsPage: fromJobsPageReducer.reducer,
  jobDescription: fromJobDescriptionReducer.reducer,
  peerMatches: fromJobPeerMatchesReducer.reducer,
  modifyPricings: fromModifyPricingsReducer.reducer
};

// Select Feature Area
export const selectJobsPageMainState =
  createFeatureSelector<JobsPageStateMain>('jobsPageMain');

// Jobs Page Selectors
export const selectJobsPageState =
  createSelector(selectJobsPageMainState, (state: JobsPageStateMain) => state.jobsPage);

export const getJobsPageId = createSelector(selectJobsPageState, fromJobsPageReducer.getJobsPageId);
export const getShowCreateProjectModal = createSelector(selectJobsPageState, fromJobsPageReducer.getShowCreateProjectModal);
export const getCreatingToProject = createSelector(selectJobsPageState, fromJobsPageReducer.getCreatingToProject);
export const getShowJobStatusModal = createSelector(selectJobsPageState, fromJobsPageReducer.getShowJobStatusModal);
export const getChangingJobStatus = createSelector(selectJobsPageState, fromJobsPageReducer.getChangingJobStatus);
export const getShowDeleteJobModal = createSelector(selectJobsPageState, fromJobsPageReducer.getShowDeleteJobModal);
export const getDeletingJob = createSelector(selectJobsPageState, fromJobsPageReducer.getDeletingJob);
export const getStructureGradeNames = createSelector(selectJobsPageState, fromJobsPageReducer.getStructureGradeNames);
export const getPricingIdToBeDeleted = createSelector(selectJobsPageState, fromJobsPageReducer.getPricingIdToBeDeleted);
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

// Modify Pricings
export const selectModifyPricingsState =
  createSelector(selectJobsPageMainState, (state: JobsPageStateMain) => state.modifyPricings);

export const getPricingsToModify = createSelector(selectModifyPricingsState, fromModifyPricingsReducer.getPricingsToModify);
export const getIsModifyingPricings = createSelector(selectModifyPricingsState, fromModifyPricingsReducer.getIsModifyingPricings);
