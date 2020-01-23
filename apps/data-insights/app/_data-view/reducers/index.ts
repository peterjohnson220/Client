import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromFormulaFieldReducer from './formula-field.reducer';

// Feature area state
export interface DataViewMainState {
  formulaField: fromFormulaFieldReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  formulaField_main: DataViewMainState;
}

// Feature area reducers
export const reducers = {
  formulaField: fromFormulaFieldReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<DataViewMainState>('dataView_main');

// Feature Selectors
export const selectFormulaFieldState = createSelector(
  selectFeatureAreaState,
  (state: DataViewMainState) => state.formulaField
);

// Formula Field Modal
export const getFormulaValidating = createSelector(
  selectFormulaFieldState,
  fromFormulaFieldReducer.getValidating
);

export const getFormulaValid = createSelector(
  selectFormulaFieldState,
  fromFormulaFieldReducer.getFormulaValid
);

export const getFormulaSaving = createSelector(
  selectFormulaFieldState,
  fromFormulaFieldReducer.getSaving
);

export const getFormulaSavingSuccess = createSelector(
  selectFormulaFieldState,
  fromFormulaFieldReducer.getSavingSuccess
);

export const getFormulaSavingError = createSelector(
  selectFormulaFieldState,
  fromFormulaFieldReducer.getSavingError
);

export const getFormulaSavingErrorMessage = createSelector(
  selectFormulaFieldState,
  fromFormulaFieldReducer.getSavingErrorMessage
);

export const getFormulaDataType = createSelector(
  selectFormulaFieldState,
  fromFormulaFieldReducer.getFormulaDataType
);

export const getFormulaViewCount = createSelector(
  selectFormulaFieldState,
  fromFormulaFieldReducer.getFormulaViewCount
);
