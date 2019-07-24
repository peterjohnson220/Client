import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromJobRangeModelingReducer from './job-range-modeling-page.reducer';

// Feature area state
export interface StructuresMainState {
  jobRangeModelingPage: fromJobRangeModelingReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  structures_main: StructuresMainState;
}

// Feature area reducers
export const reducers = {
  jobRangeModelingPage: fromJobRangeModelingReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<StructuresMainState>('structures_main');

// Feature Selectors
export const selectJobRangeModelingPageState = createSelector(
  selectFeatureAreaState,
  (state: StructuresMainState) => state.jobRangeModelingPage
);

// Job Range Modeling Page
export const getCurrentModel = createSelector(
  selectJobRangeModelingPageState,
  fromJobRangeModelingReducer.getCurrentModel
);

export const getCurrentStructure = createSelector(
  selectJobRangeModelingPageState,
  fromJobRangeModelingReducer.getCurrentStructure
);

export const getIsEditModelNameLoading = createSelector(
  selectJobRangeModelingPageState,
  fromJobRangeModelingReducer.getIsEditModelNameLoading
);

export const getEditModelNameError = createSelector(
  selectJobRangeModelingPageState,
  fromJobRangeModelingReducer.getEditModelNameError
);
