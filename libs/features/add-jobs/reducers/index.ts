import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer

import * as fromRoot from 'libs/state/state';
// Import feature reducers
import * as fromJobBasedRangesAddJobsModalReducer from './job-based-ranges-add-jobs-modal.reducer';

// Feature area state
export interface AddJobsState {
  jobsBasedRangesAddJobsModal: fromJobBasedRangesAddJobsModalReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  addJobsState: AddJobsState;
}

// Feature area reducers
export const reducers = {
  jobsBasedRangesAddJobsModal: fromJobBasedRangesAddJobsModalReducer.reducer
};

// Select Feature Area
export const selectAddJobsState = createFeatureSelector<AddJobsState>('add_jobs_state');

// Feature Selectors
export const selectJobsBasedRangesAddJobsModalState = createSelector(
  selectAddJobsState,
  (state: AddJobsState) => state.jobsBasedRangesAddJobsModal
);

// Add Jobs Structures Modeling Modal
export const getAddJobsModalOpen = createSelector(
  selectJobsBasedRangesAddJobsModalState,
  fromJobBasedRangesAddJobsModalReducer.getAddJobsModalOpen
);
