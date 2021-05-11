import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromSharedReducer from './shared.reducer';
import * as fromSwitchRegressionFlagsReducer from './switch-regression-flags-modal.reducer';


// Feature area state
export interface GradeBasedRangeSharedState {
  shared: fromSharedReducer.State;
  switchRegressionFlags: fromSwitchRegressionFlagsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  structures_gradeBasedRange_shared: GradeBasedRangeSharedState;
}

// Feature area reducers
export const reducers = {
  shared: fromSharedReducer.reducer,
  switchRegressionFlags: fromSwitchRegressionFlagsReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState =
  createFeatureSelector<GradeBasedRangeSharedState>('structures_gradeBasedRange_shared');


// Selectors
export const selectSharedState = createSelector(
  selectFeatureAreaState,
  (state: GradeBasedRangeSharedState) => state.shared
);
export const selectSwitchRegressionFlagsState = createSelector(
  selectFeatureAreaState,
  (state: GradeBasedRangeSharedState) => state.switchRegressionFlags
);


// Shared
export const getGradesDetails = createSelector(
  selectSharedState,
  fromSharedReducer.getGradesDetails
);

export const getOpenAddJobs = createSelector(
  selectSharedState,
  fromSharedReducer.getOpenAddJobs
);

// Switch Regression Flags
export const getSwitchRegressionFlagsModalOpen = createSelector(
  selectSwitchRegressionFlagsState, fromSwitchRegressionFlagsReducer.getModalOpen
);

export const getSwitchRegressionFlagsAsyncObj = createSelector(
  selectSwitchRegressionFlagsState, fromSwitchRegressionFlagsReducer.getSwitchRegressionFlagsAsyncObj
);

export const getGradePoints = createSelector(
  selectSwitchRegressionFlagsState, fromSwitchRegressionFlagsReducer.getGradePoints
);

