import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromCreateNewJobPageReducer from './create-new-job-page.reducer';

// Feature area state
export interface AddJobsState {
  createNewJobPage: fromCreateNewJobPageReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  project_addJobs: AddJobsState;
}

// Feature area reducers
export const reducers = {
  createNewJobPage: fromCreateNewJobPageReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<AddJobsState>('project_addJobs');

// Feature Selectors
export const selectCreateNewJobPageState = createSelector(
  selectFeatureAreaState,
  (state: AddJobsState) => state.createNewJobPage
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
