import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from 'libs/state/state';

import * as fromJobsHierarchyReducer from './jobs-hierarchy.reducer';

// Feature area state
export interface JobsHierarchyState {
  jobsHierarchy: fromJobsHierarchyReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  jobsHierarchy_main: JobsHierarchyState;
}

// Feature area reducers
export const reducers = {
  jobsHierarchy: fromJobsHierarchyReducer.reducer
};

export const selectFeatureAreaState = createFeatureSelector<JobsHierarchyState>('jobsHierarchyPage_main');

export const selectJobsHierarchyState = createSelector(
  selectFeatureAreaState,
  (state: JobsHierarchyState) => state.jobsHierarchy
);

export const getJobFamilies = createSelector(
  selectJobsHierarchyState,
  fromJobsHierarchyReducer.getJobFamilies
);

export const getJobLevels = createSelector(
  selectJobsHierarchyState,
  fromJobsHierarchyReducer.getJobLevels
);

export const getJobLevelHierachies = createSelector(
  selectJobsHierarchyState,
  fromJobsHierarchyReducer.getJobLevelHierachies
);

export const getJobLevelsForJobFamiliesDetails = createSelector(
  selectJobsHierarchyState,
  fromJobsHierarchyReducer.getJobLevelsForJobFamiliesDetails
);

export const getSelectedHierarchy = createSelector(
  selectJobsHierarchyState,
  fromJobsHierarchyReducer.getSelectedHierachy
);

export const getResetHierarchyForm = createSelector(
  selectJobsHierarchyState,
  fromJobsHierarchyReducer.getResetHierarchyForm
);
