import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromPageReducer from './page.reducer';
import * as fromAddJobsModalReducer from './add-jobs-modal.reducer';
import * as fromSearchResultsReducer from './search-results.reducer';

// Feature area state
export interface JobBasedRangeState {
  page: fromPageReducer.State;
  addJobsModal: fromAddJobsModalReducer.State;
  searchResults: fromSearchResultsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  structures_jobBasedRange: JobBasedRangeState;
}

// Feature area reducers
export const reducers = {
  page: fromPageReducer.reducer,
  addJobsModal: fromAddJobsModalReducer.reducer,
  searchResults: fromSearchResultsReducer.reducer
};

// Select Feature Area
export const selectJobBasedRangePageState =
  createFeatureSelector<JobBasedRangeState>('structures_jobBasedRange');


// Selectors
export const selectPageState =
  createSelector(selectJobBasedRangePageState, (state: JobBasedRangeState) => state.page);

export const selectAddJobsState =
  createSelector(selectJobBasedRangePageState, (state: JobBasedRangeState) => state.addJobsModal);

export const selectSearchResultsState =
  createSelector(selectJobBasedRangePageState, (state: JobBasedRangeState) => state.searchResults);

// Page
export const getPageTitle = createSelector(
  selectPageState, fromPageReducer.getPageTitle
);

// Add Jobs Modal
export const getAddJobsModalOpen = createSelector(
  selectAddJobsState,
  fromAddJobsModalReducer.getAddJobsModalOpen
);

export const getContext = createSelector(
  selectAddJobsState,
  fromAddJobsModalReducer.getContext
);

export const getAddingData = createSelector(
  selectAddJobsState,
  fromAddJobsModalReducer.getAddingData
);

export const getAddingDataError = createSelector(
  selectAddJobsState,
  fromAddJobsModalReducer.getAddingDataError
);

export const getAddingDataErrorMessage = createSelector(
  selectAddJobsState,
  fromAddJobsModalReducer.getAddingDataErrorMessage
);

// Search Results
export const getJobs = createSelector(
  selectSearchResultsState,
  fromSearchResultsReducer.getJobs
);

export const getSelectedJobIds = createSelector(
  selectSearchResultsState,
  fromSearchResultsReducer.getSelectedJobIds
);

export const getSelectedPayfactorsJobCodes = createSelector(
  selectSearchResultsState,
  fromSearchResultsReducer.getSelectedPayfactorsJobCodes
);
