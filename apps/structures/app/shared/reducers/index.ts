import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromSharedReducer from './shared.reducer';
import * as fromModelSettingsModalReducer from './model-settings-modal.reducer';
import * as fromFormulaFieldReducer from './formula-field.reducer';


// Feature area state
export interface StructuresSharedState {
  shared: fromSharedReducer.State;
  modelSettingsModal: fromModelSettingsModalReducer.State;
  formulaFields: fromFormulaFieldReducer.State;

}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  structures_shared: StructuresSharedState;
}

// Feature area reducers
export const reducers = {
  shared: fromSharedReducer.reducer,
  modelSettingsModal: fromModelSettingsModalReducer.reducer,
  formulaFields: fromFormulaFieldReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState =
  createFeatureSelector<StructuresSharedState>('structures_shared');


// Selectors
export const selectSharedState = createSelector(
  selectFeatureAreaState,
  (state: StructuresSharedState) => state.shared
);

export const selectModelSettingsModalState = createSelector(
  selectFeatureAreaState,
  (state: StructuresSharedState) => state.modelSettingsModal
);

export const selectFormulaFieldState = createSelector(
  selectFeatureAreaState,
  (state: StructuresSharedState) => state.formulaFields
);

// Shared
export const getMetadata = createSelector(
  selectSharedState, fromSharedReducer.getMetadata
);

export const getRoundingSettings = createSelector(
  selectSharedState, fromSharedReducer.getRoundingSettings
);

export const getCompanyExchanges = createSelector(
  selectSharedState,
  fromSharedReducer.getCompanyExchanges
);

export const getSelectedPeerExchange = createSelector(
  selectSharedState,
  fromSharedReducer.getSelectedPeerExchange
);

export const getRangeOverrides = createSelector(
  selectSharedState, fromSharedReducer.getRangeOverrides
);

export const getDistinctOverrideMessages = createSelector(
  selectSharedState, fromSharedReducer.getDistinctOverrideMessages
);

export const getComparingModels = createSelector(
  selectSharedState,
  fromSharedReducer.getComparingModels
);

export const getCompareEnabled = createSelector(
  selectSharedState,
  fromSharedReducer.getCompareEnabled
);

export const getCurrentRangeGroup = createSelector(
  selectSharedState,
  fromSharedReducer.getCurrentRangeGroup
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

export const getSurveyUdfsAsyncObj = createSelector(
  selectModelSettingsModalState, fromModelSettingsModalReducer.getSurveyUdfsAsyncObj
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

export const getActiveTab = createSelector(
  selectModelSettingsModalState, fromModelSettingsModalReducer.getActiveTab
);

// Formula Field Modal
export const getFormulaWaitingForValidation = createSelector(
  selectFormulaFieldState,
  fromFormulaFieldReducer.getWaitingForValidation
);

export const getFormulaValidating = createSelector(
  selectFormulaFieldState,
  fromFormulaFieldReducer.getValidating
);

export const getFormulaValid = createSelector(
  selectFormulaFieldState,
  fromFormulaFieldReducer.getFormulaValid
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

export const getFormulaField = createSelector(
  selectFormulaFieldState,
  fromFormulaFieldReducer.getFormulaField
);

export const getResetFormula = createSelector(
  selectFormulaFieldState,
  fromFormulaFieldReducer.getResetFormula
);

export const getAllFields = createSelector(
  selectFormulaFieldState,
  fromFormulaFieldReducer.getAllFields
);

