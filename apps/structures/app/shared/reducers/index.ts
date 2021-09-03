import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromSharedReducer from './shared.reducer';
import * as fromModelSettingsModalReducer from './model-settings-modal.reducer';
import * as fromFormulaFieldReducer from './formula-field.reducer';
import * as fromPublishModelModalReducer from './publish-model-modal.reducer';
import * as fromDuplicateModelModalReducer from './duplicate-model-modal.reducer';
import * as fromFieldsReducer from './fields.reducer';

// Feature area state
export interface StructuresSharedState {
  shared: fromSharedReducer.State;
  modelSettingsModal: fromModelSettingsModalReducer.State;
  formulaFields: fromFormulaFieldReducer.State;
  publishModelModal: fromPublishModelModalReducer.State;
  duplicateModelModal: fromDuplicateModelModalReducer.State;
  fields: fromFieldsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  structures_shared: StructuresSharedState;
}

// Feature area reducers
export const reducers = {
  shared: fromSharedReducer.reducer,
  modelSettingsModal: fromModelSettingsModalReducer.reducer,
  formulaFields: fromFormulaFieldReducer.reducer,
  publishModelModal: fromPublishModelModalReducer.reducer,
  duplicateModelModal: fromDuplicateModelModalReducer.reducer,
  fields: fromFieldsReducer.reducer
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

export const selectPublishModelModalState = createSelector(
  selectFeatureAreaState,
  (state: StructuresSharedState) => state.publishModelModal
);

export const selectDuplicateModelModalState = createSelector(
  selectFeatureAreaState,
  (state: StructuresSharedState) => state.duplicateModelModal
);

export const selectFieldsState = createSelector(
  selectFeatureAreaState,
  (state: StructuresSharedState) => state.fields
);

// Shared
export const getGradeRangeDetails = createSelector(
  selectSharedState,
  fromSharedReducer.getGradeRangeDetails
);

export const getMetadata = createSelector(
  selectSharedState, fromSharedReducer.getMetadata
);

export const getLoadingMetaData = createSelector(selectSharedState, fromSharedReducer.getLoadingMetaData);

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
export const getGradeModelSettingsModalOpen = createSelector(
  selectModelSettingsModalState, fromModelSettingsModalReducer.getGradeModelSettingsModalOpen
);

export const getJobModelSettingsModalOpen = createSelector(
  selectModelSettingsModalState, fromModelSettingsModalReducer.getJobModelSettingsModalOpen
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

export const getGradesDetails = createSelector(
  selectModelSettingsModalState, fromModelSettingsModalReducer.getGradesDetails
);

export const getStructureHasSettings = createSelector(
  selectModelSettingsModalState, fromModelSettingsModalReducer.getStructureHasSettings
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

// Publish Model Modal
export const getPublishModelModalOpen = createSelector(
  selectPublishModelModalState, fromPublishModelModalReducer.getModalOpen
);

export const getPublishingModelAsyncObj = createSelector(
  selectPublishModelModalState, fromPublishModelModalReducer.getPublishingModelAsyncObj
);

// Duplicate Model Modal
export const getDuplicateModelModalOpen = createSelector(
  selectDuplicateModelModalState, fromDuplicateModelModalReducer.getModalOpen
);

export const getDuplicatingModelAsyncObj = createSelector(
  selectDuplicateModelModalState, fromDuplicateModelModalReducer.getDuplicatingModelAsyncObj
);

export const getDuplicateModelNameExistsFailure = createSelector(
  selectDuplicateModelModalState, fromDuplicateModelModalReducer.getDuplicateModelNameExistsFailure
);

// Formula Fields
export const getAvailablePricingFields = createSelector(
  selectFieldsState, fromFieldsReducer.getReportFieldsAsync
);

export const getFormulaFieldSuggestions = createSelector(
  selectFieldsState,
  fromFieldsReducer.getFormulaFieldSuggestions
);

export const getRemovingRange = createSelector(selectSharedState, fromSharedReducer.getRemovingRange);
