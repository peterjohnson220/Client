import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromModelingSettingsPageReducer from './modeling-settings-page.reducer';

// Feature area state
export interface JobBasedRangeState {
  modelingSettingsPage: fromModelingSettingsPageReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  structures_jobBasedRange: JobBasedRangeState;
}

// Feature area reducers
export const reducers = {
  modelingSettingsPage: fromModelingSettingsPageReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState =
  createFeatureSelector<JobBasedRangeState>('structures_jobBasedRange');


// Selectors
export const selectModelingSettingsState = createSelector(
  selectFeatureAreaState,
  (state: JobBasedRangeState) => state.modelingSettingsPage
);

// Modeling Settings Page
export const getCurrenciesAsync = createSelector(
  selectModelingSettingsState,
  fromModelingSettingsPageReducer.getCurrenciesAsync
);

export const getStandardPayElementsAsync = createSelector(
  selectModelingSettingsState,
  fromModelingSettingsPageReducer.getStandardPayElementsAsync
);


export const getCreateModelAsync = createSelector(
  selectModelingSettingsState,
  fromModelingSettingsPageReducer.getCreateModelAsync
);
