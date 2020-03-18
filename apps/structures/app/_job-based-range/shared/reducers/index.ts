import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromSharedReducer from './shared.reducer';
import * as fromModelSettingsModalReducer from './model-settings-modal.reducer';

// Feature area state
export interface JobBasedRangeSharedState {
  shared: fromSharedReducer.State;
  modelSettingsModal: fromModelSettingsModalReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  structures_jobBasedRange_shared: JobBasedRangeSharedState;
}

// Feature area reducers
export const reducers = {
  shared: fromSharedReducer.reducer,
  modelSettingsModal: fromModelSettingsModalReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState =
  createFeatureSelector<JobBasedRangeSharedState>('structures_jobBasedRange_shared');


// Selectors
export const selectSharedState = createSelector(
  selectFeatureAreaState,
  (state: JobBasedRangeSharedState) => state.shared
);

export const selectModelSettingsModalState = createSelector(
  selectFeatureAreaState,
  (state: JobBasedRangeSharedState) => state.modelSettingsModal
);

// Shared
export const getMetadata = createSelector(
  selectSharedState, fromSharedReducer.getMetadata
);

// Model Settings Modal
export const getModelSettingsModalOpen = createSelector(
  selectModelSettingsModalState, fromModelSettingsModalReducer.getModalOpen
);

export const getCurrenciesAsyncObj = createSelector(
  selectModelSettingsModalState, fromModelSettingsModalReducer.getCurrenciesAsyncObj
);

export const getControlPointsAsyncObj = createSelector(
  selectModelSettingsModalState, fromModelSettingsModalReducer.getControlPointsAsyncObj
);

export const getStructureNameSuggestionsAsyncObj = createSelector(
  selectModelSettingsModalState, fromModelSettingsModalReducer.getStructureNameSuggestionsAsyncObj
);

export const getSavingModelSettingsAsyncObj = createSelector(
  selectModelSettingsModalState, fromModelSettingsModalReducer.getSavingModelSettingsAsyncObj
);

export const getModelNameExistsFailure = createSelector(
  selectModelSettingsModalState, fromModelSettingsModalReducer.getModelNameExistsFailure
);
