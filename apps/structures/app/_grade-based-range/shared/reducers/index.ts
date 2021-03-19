import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromSharedReducer from './shared.reducer';

// Feature area state
export interface GradeBasedRangeSharedState {
  shared: fromSharedReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  structures_gradeBasedRange_shared: GradeBasedRangeSharedState;
}

// Feature area reducers
export const reducers = {
  shared: fromSharedReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState =
  createFeatureSelector<GradeBasedRangeSharedState>('structures_gradeBasedRange_shared');


// Selectors
export const selectSharedState = createSelector(
  selectFeatureAreaState,
  (state: GradeBasedRangeSharedState) => state.shared
);

// Shared
export const getGradeRangeDetails = createSelector(
  selectSharedState,
  fromSharedReducer.getGradeRangeDetails
);

export const getGradesDetails = createSelector(
  selectSharedState,
  fromSharedReducer.getGradesDetails
);
