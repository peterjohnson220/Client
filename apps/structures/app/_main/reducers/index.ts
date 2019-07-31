import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromStructuresReducer from './structures.reducer';
import * as fromJobRangeModelingReducer from './job-range-modeling-page.reducer';
import * as fromJobBasedRangeAllStructuresReducer from './job-based-range-all-structures.reducer';

// Feature area state
export interface StructuresMainState {
  structuresPage: fromStructuresReducer.State;
  jobRangeModelingPage: fromJobRangeModelingReducer.State;
  jobBasedRangeAllStructuresComponent: fromJobBasedRangeAllStructuresReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  structures_main: StructuresMainState;
}

// Feature area reducers
export const reducers = {
  structuresPage: fromStructuresReducer.reducer,
  jobRangeModelingPage: fromJobRangeModelingReducer.reducer,
  jobBasedRangeAllStructuresComponent: fromJobBasedRangeAllStructuresReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<StructuresMainState>('structures_main');

// Feature Selectors
export const selectStructuresPageState = createSelector(
  selectFeatureAreaState,
  (state: StructuresMainState) => state.structuresPage
);

export const selectJobRangeModelingPageState = createSelector(
  selectFeatureAreaState,
  (state: StructuresMainState) => state.jobRangeModelingPage
);

export const selectJobBasedRangeAllStructuresComponentState = createSelector(
  selectFeatureAreaState,
  (state: StructuresMainState) => state.jobBasedRangeAllStructuresComponent
);

// Structures Page
export const getCompanyStructuresAsync = createSelector(
  selectStructuresPageState,
  fromStructuresReducer.getCompanyStructuresAsync
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

// Job Based Range All Structures Component
export const getCompanyStructureViewsAsync = createSelector(
  selectJobBasedRangeAllStructuresComponentState,
  fromJobBasedRangeAllStructuresReducer.getCompanyStructureViewsAsync
);

export const getFilteredCompanyStructures = createSelector(
  selectJobBasedRangeAllStructuresComponentState,
  fromJobBasedRangeAllStructuresReducer.getFilteredCompanyStructures
);
