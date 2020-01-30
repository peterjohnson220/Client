import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromAddJobsPageReducer from './add-jobs-page.reducer';
import * as fromCreateNewJobPageReducer from './create-new-job-page.reducer';
import * as fromSearchResultsReducer from './search-results.reducer';

// Feature area state
export interface AddJobsState {
  addJobsPage: fromAddJobsPageReducer.State;
  createNewJobPage: fromCreateNewJobPageReducer.State;
  searchResults: fromSearchResultsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  project_addJobs: AddJobsState;
}

// Feature area reducers
export const reducers = {
  addJobsPage: fromAddJobsPageReducer.reducer,
  createNewJobPage: fromCreateNewJobPageReducer.reducer,
  searchResults: fromSearchResultsReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<AddJobsState>('project_addJobs');

// Feature Selectors
export const selectAddJobsPageState = createSelector(
  selectFeatureAreaState,
  (state: AddJobsState) => state.addJobsPage
);

export const selectCreateNewJobPageState = createSelector(
  selectFeatureAreaState,
  (state: AddJobsState) => state.createNewJobPage
);

export const selectSearchResultsState = createSelector(
  selectFeatureAreaState,
  (state: AddJobsState) => state.searchResults
);

// Add Jobs Page
export const getContext = createSelector(
  selectAddJobsPageState,
  fromAddJobsPageReducer.getContext
);

export const getAddingData = createSelector(
  selectAddJobsPageState,
  fromAddJobsPageReducer.getAddingData
);

export const getAddingDataError = createSelector(
  selectAddJobsPageState,
  fromAddJobsPageReducer.getAddingDataError
);

export const getAddingDataErrorMessage = createSelector(
  selectAddJobsPageState,
  fromAddJobsPageReducer.getAddingDataErrorMessage
);

// Create New Job Page
export const getJdmEnabled = createSelector(
  selectCreateNewJobPageState,
  fromCreateNewJobPageReducer.getJdmEnabled
);

export const getJobFamilies = createSelector(
  selectCreateNewJobPageState,
  fromCreateNewJobPageReducer.getJobFamilies
);

export const getLoadingJobFamilies = createSelector(
  selectCreateNewJobPageState,
  fromCreateNewJobPageReducer.getLoadingJobFamilies
);

export const getCreatingJob = createSelector(
  selectCreateNewJobPageState,
  fromCreateNewJobPageReducer.getCreatingJob
);

export const getCreatingJobError = createSelector(
  selectCreateNewJobPageState,
  fromCreateNewJobPageReducer.getCreatingJobError
);

export const getJobCodeExists = createSelector(
  selectCreateNewJobPageState,
  fromCreateNewJobPageReducer.getJobCodeExits
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

export const getSelectedPayfactorsJobCodes = createSelector(
  selectSearchResultsState,
  fromSearchResultsReducer.getSelectedPayfactorsJobCodes
);
