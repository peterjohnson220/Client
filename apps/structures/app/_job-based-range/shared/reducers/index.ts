
import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromSharedReducer from './shared.reducer';
import * as fromModelSettingsModalReducer from '../../../shared/reducers/model-settings-modal.reducer';
import * as fromFieldsReducer from './fields.reducer';
import * as fromFormulaFieldReducer from '../../../shared/reducers/formula-field.reducer';

// Feature area state
export interface JobBasedRangeSharedState {
  shared: fromSharedReducer.State;
  fields: fromFieldsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  structures_jobBasedRange_shared: JobBasedRangeSharedState;
}

// Feature area reducers
export const reducers = {
  shared: fromSharedReducer.reducer,
  fields: fromFieldsReducer.reducer,
};

// Select Feature Area
export const selectFeatureAreaState =
  createFeatureSelector<JobBasedRangeSharedState>('structures_jobBasedRange_shared');


// Selectors
export const selectSharedState = createSelector(
  selectFeatureAreaState,
  (state: JobBasedRangeSharedState) => state.shared
);

export const selectFieldsState = createSelector(
  selectFeatureAreaState,
  (state: JobBasedRangeSharedState) => state.fields
);


export const getRemovingRange = createSelector(selectSharedState, fromSharedReducer.getRemovingRange);


export const getStructureHasSettings = createSelector(
  selectSharedState,
  fromSharedReducer.getStructureHasSettings
);

// Formula Fields
export const getAvailablePricingFields = createSelector(
  selectFieldsState, fromFieldsReducer.getReportFieldsAsync
);

export const getFormulaFieldSuggestions = createSelector(
  selectFieldsState,
  fromFieldsReducer.getFormulaFieldSuggestions
);

