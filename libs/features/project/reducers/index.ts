import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer

import * as fromRoot from 'libs/state/state';
// Import feature reducers
import * as fromAddJobsStructuresModelingReducers from './add-jobs-structures-modeling.reducer';

// Feature area state
export interface FeaturesState {
  addJobsStructuresModeling: fromAddJobsStructuresModelingReducers.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  featuresState: FeaturesState;
}

// Feature area reducers
export const reducers = {
  addJobsStructuresModeling: fromAddJobsStructuresModelingReducers.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<FeaturesState>('projects_state');

// Feature Selectors
export const selectAddJobsStructuresModelingState = createSelector(
  selectFeatureAreaState,
  (state: FeaturesState) => state.addJobsStructuresModeling
);

// Add Jobs Structures Modeling Modal
export const getAddJobsModalOpen = createSelector(
  selectAddJobsStructuresModelingState,
  fromAddJobsStructuresModelingReducers.getAddJobsModalOpen
);
