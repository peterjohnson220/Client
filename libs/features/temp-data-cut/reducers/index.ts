import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromTempDataCutReducer from './temp-data-cut.reducer';

// Feature area state
export interface TempDataCutState {
  tempDataCut: fromTempDataCutReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_tempDataCut: TempDataCutState;
}

// Feature area reducers
export const reducers = {
  tempDataCut: fromTempDataCutReducer.reducer
};

// Select Feature Area
export const selectFeatureTempDataCutState = createFeatureSelector<TempDataCutState>(
  'feature_tempDataCut'
);

// Feature Selectors
export const selectTempDataCutState = createSelector(
  selectFeatureTempDataCutState,
  (state: TempDataCutState) => !!state ? state.tempDataCut : {}
);

// Temp Data Cut
export const getTempDataCutUpsert = createSelector(selectTempDataCutState, fromTempDataCutReducer.getUpserting);
export const getTempDataCutComplete = createSelector(selectTempDataCutState, fromTempDataCutReducer.getComplete);
export const getTempDataCutFilterContextDictionary = createSelector(selectTempDataCutState, fromTempDataCutReducer.getFilterContextDictionary);
export const getTempDataCutCurrentIdentity = createSelector(selectTempDataCutState, fromTempDataCutReducer.getCurrent);
export const getTempDataCutCreating = createSelector(selectTempDataCutState, fromTempDataCutReducer.getCreating);
export const getTempDataCutEditing = createSelector(selectTempDataCutState, fromTempDataCutReducer.getEditing);
