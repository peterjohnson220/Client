import { createSelector, createFeatureSelector, ActionReducerMap } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from '../../shared/state';

// Import feature reducers
import * as fromJobSearchReducer from './job-search.reducers';
import * as fromJobDetailReducer from './job-detail.reducer';
import * as fromPriceJobReducer from './price-job.reducer';
import * as fromRelatedJobsReducer from './related-jobs.reducer';

// Feature area state
export interface JobSearchAreaState {
  jobSearch: fromJobSearchReducer.State;
  jobDetail: fromJobDetailReducer.State;
  priceJob: fromPriceJobReducer.State;
  relatedJobs: fromRelatedJobsReducer.State;
}

// Extend root state with feature state
export interface State extends fromRoot.AppState {
  jobSearchArea: JobSearchAreaState;
}

export const reducers: ActionReducerMap<JobSearchAreaState> = {
  jobSearch: fromJobSearchReducer.reducer,
  jobDetail: fromJobDetailReducer.reducer,
  priceJob: fromPriceJobReducer.reducer,
  relatedJobs: fromRelatedJobsReducer.reducer
};

export const selectFeatureAreaState = createFeatureSelector<JobSearchAreaState>('jobSearchArea');

// job search
export const selectJobSearchState = createSelector(selectFeatureAreaState, (jobSearchArea: JobSearchAreaState) => jobSearchArea.jobSearch);
export const selectSearchTerm = createSelector(selectJobSearchState, fromJobSearchReducer.getSearchTerm);
export const selectIsSearching = createSelector(selectJobSearchState, fromJobSearchReducer.getIsSearching);
export const selectSearchSuccess = createSelector(selectJobSearchState, fromJobSearchReducer.getSearchSuccess);
export const selectSearchFailure = createSelector(selectJobSearchState, fromJobSearchReducer.getSearchFailure);
export const selectSearchResult = createSelector(selectJobSearchState, fromJobSearchReducer.getSearchResult);

// job detail
export const selectJobLoadState = createSelector(selectFeatureAreaState, (jobDetailArea: JobSearchAreaState) => jobDetailArea.jobDetail);
export const selectIsLoading = createSelector(selectJobLoadState, fromJobDetailReducer.getIsLoading);
export const selectLoadSuccess = createSelector(selectJobLoadState, fromJobDetailReducer.getLoadSuccess);
export const selectLoadFailure = createSelector(selectJobLoadState, fromJobDetailReducer.getLoadFailure);
export const selectJob = createSelector(selectJobLoadState, fromJobDetailReducer.getJob);

// price job
export const selectPriceJobState = createSelector(selectFeatureAreaState, (jobDetailArea: JobSearchAreaState) => jobDetailArea.priceJob);
export const selectIsSearchingLocation = createSelector(selectPriceJobState, fromPriceJobReducer.getIsSearchingLocation);
export const selectLocationSearchTerm = createSelector(selectPriceJobState, fromPriceJobReducer.getLocationSearchTerm);
export const selectSelectedLocation = createSelector(selectPriceJobState, fromPriceJobReducer.getSelectedLocation);
export const selectLocationResults = createSelector(selectPriceJobState, fromPriceJobReducer.getLocationResults);

// related jobs
export const selectRelatedJobsState = createSelector(selectFeatureAreaState,
  (jobSearchArea: JobSearchAreaState) => jobSearchArea.relatedJobs);
export const selectIsLoadingRelatedJobs = createSelector(selectRelatedJobsState, fromRelatedJobsReducer.getIsLoading);
export const selectLoadRelatedJobsSuccess = createSelector(selectRelatedJobsState, fromRelatedJobsReducer.getLoadSuccess);
export const selectLoadRelatedJobsFailure = createSelector(selectRelatedJobsState, fromRelatedJobsReducer.getLoadFailure);
export const selectRelatedJobs = createSelector(selectRelatedJobsState, fromRelatedJobsReducer.getSearchResult);
