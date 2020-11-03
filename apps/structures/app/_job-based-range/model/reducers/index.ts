import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from 'libs/state/state';

import * as fromCompareJobRangeReducer from './compare-job-ranges.reducer';

export interface JobRangeState {
  compareJobRange: fromCompareJobRangeReducer.State;
}

export interface State extends fromRoot.State {
  model_jobRange: JobRangeState;
}

export const reducers = {
  compareJobRange: fromCompareJobRangeReducer.reducer
};

export const selectFeatureAreaState =
  createFeatureSelector<JobRangeState>('model_jobRange');

export const selectCompareJobRangeState = createSelector(
  selectFeatureAreaState,
  (state: JobRangeState) => state.compareJobRange
);

export const getDataForCompare = createSelector(selectCompareJobRangeState, fromCompareJobRangeReducer.getDataForCompare);
