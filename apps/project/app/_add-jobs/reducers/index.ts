import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromAddJobsPageReducer from './add-jobs-page.reducer';

// Feature area state
export interface AddJobsState {
  addJobsPage: fromAddJobsPageReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  project_addJobs: AddJobsState;
}

// Feature area reducers
export const reducers = {
  addSurveyDataPage: fromAddJobsPageReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<AddJobsState>('project_addJobs');

// Feature Selectors
export const selectAddJobsPageState = createSelector(
  selectFeatureAreaState,
  (state: AddJobsState) => state.addJobsPage
);
