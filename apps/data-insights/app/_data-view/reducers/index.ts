import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromFormulaFieldModalReducer from './formula-field-modal.reducer';

// Feature area state
export interface DataViewMainState {
  formulaFieldModal: fromFormulaFieldModalReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  formulaFieldModal_main: DataViewMainState;
}

// Feature area reducers
export const reducers = {
  formulaFieldModal: fromFormulaFieldModalReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<DataViewMainState>('dataView_main');

// Feature Selectors
export const selectFormulaFieldModalState = createSelector(
  selectFeatureAreaState,
  (state: DataViewMainState) => state.formulaFieldModal
);

// Formula Field Modal
export const getFormulaValidating = createSelector(
  selectFormulaFieldModalState,
  fromFormulaFieldModalReducer.getValidating
);

export const getFormulaValid = createSelector(
  selectFormulaFieldModalState,
  fromFormulaFieldModalReducer.getFormulaValid
);

export const getFormulaSaving = createSelector(
  selectFormulaFieldModalState,
  fromFormulaFieldModalReducer.getSaving
);

export const getFormulaSavingSuccess = createSelector(
  selectFormulaFieldModalState,
  fromFormulaFieldModalReducer.getSavingSuccess
);

export const getFormulaSavingError = createSelector(
  selectFormulaFieldModalState,
  fromFormulaFieldModalReducer.getSavingError
);

export const getFormulaSavingErrorMessage = createSelector(
  selectFormulaFieldModalState,
  fromFormulaFieldModalReducer.getSavingErrorMessage
);

export const getFormulaDataType = createSelector(
  selectFormulaFieldModalState,
  fromFormulaFieldModalReducer.getFormulaDataType
);
