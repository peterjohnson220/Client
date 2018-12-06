import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromAddJobsPageReducer from './add-jobs-page.reducer';
import * as fromSearchResultsReducer from './search-results.reducer';

// Feature area state
export interface AddJobsState {
  addJobsPage: fromAddJobsPageReducer.State;
  searchResults: fromSearchResultsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  project_addJobs: AddJobsState;
}

// Feature area reducers
export const reducers = {
  addSurveyDataPage: fromAddJobsPageReducer.reducer,
  searchResults: fromSearchResultsReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<AddJobsState>('project_addJobs');

// Feature Selectors
export const selectAddJobsPageState = createSelector(
  selectFeatureAreaState,
  (state: AddJobsState) => state.addJobsPage
);

export const selectSearchResultsState = createSelector(
  selectFeatureAreaState,
  (state: AddJobsState) => state.searchResults
);

// Search Results Selectors
export const getJobs = createSelector(
  selectSearchResultsState,
  fromSearchResultsReducer.getJobs
);

export const getSelectedJobIds = createSelector(
  selectSearchResultsState,
  fromSearchResultsReducer.getSelectedJobIds
);

export const getHasMoreResultsOnServer = createSelector(
  selectSearchResultsState,
  fromSearchResultsReducer.hasMoreResultsOnServer
);

export const getLoadingMoreResults = createSelector(
  selectSearchResultsState,
  fromSearchResultsReducer.getLoadingMoreResults
);
