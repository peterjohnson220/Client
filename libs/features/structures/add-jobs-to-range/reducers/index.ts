import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromJobsToGradeReducer from './jobs-to-grade.reducer';

import { AddJobsState } from '../../../jobs/add-jobs/reducers';

// Feature area state
export interface AddJobsToRangeState extends AddJobsState {
  jobsToGrade: fromJobsToGradeReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_addJobsToRange: AddJobsToRangeState;
}

// Feature area reducers
export const reducers = {
  jobsToGrade: fromJobsToGradeReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<AddJobsToRangeState>('feature_addJobsToRange');

// Feature Selectors
export const selectJobsToGradeState = createSelector(
  selectFeatureAreaState,
  (state: AddJobsToRangeState) => state.jobsToGrade
);

// Jobs to Grade Page Selectors


export const getLoadingGrades = createSelector(
  selectJobsToGradeState,
  fromJobsToGradeReducer.getLoadingGrades
);

export const getGrades = createSelector(
  selectJobsToGradeState,
  fromJobsToGradeReducer.getGrades
);

export const getLoadingGradesError = createSelector(
  selectJobsToGradeState,
  fromJobsToGradeReducer.getLoadingGradesError
);



