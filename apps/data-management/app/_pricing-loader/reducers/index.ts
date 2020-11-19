import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromPricingLoaderReducer from './pricing-loader.reducer';
import * as fromUploadPricingFileReducer from './upload-pricing-file.reducer';
import * as fromDefaultSettingsReducer from './default-settings.reducer';

// Feature area state
export interface PricingLoaderMainState {
  pricingLoader: fromPricingLoaderReducer.State;
  uploadPricingFile: fromUploadPricingFileReducer.State;
  defaultSettings: fromDefaultSettingsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  pricingloader_main: PricingLoaderMainState;
}

// Feature area reducers
export const reducers = {
  pricingLoader: fromPricingLoaderReducer.reducer,
  uploadPricingFile: fromUploadPricingFileReducer.reducer,
  defaultSettings: fromDefaultSettingsReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<PricingLoaderMainState>('pricingloader_main');

// Feature Selectors
export const selectUploadPricingFileState = createSelector(
  selectFeatureAreaState,
  (state: PricingLoaderMainState) => state.uploadPricingFile
);
export const selectPricingLoaderState = createSelector(selectFeatureAreaState, (state: PricingLoaderMainState) => state.pricingLoader);
export const selectDefaultSettingsState = createSelector(selectFeatureAreaState, (state: PricingLoaderMainState) => state.defaultSettings);

// Pricing Loader
export const getConfigGroup = createSelector(selectPricingLoaderState, fromPricingLoaderReducer.getConfigGroup);
export const getEmailRecipient = createSelector(selectPricingLoaderState, fromPricingLoaderReducer.getEmailRecipient);
export const getProcessing = createSelector(selectPricingLoaderState, fromPricingLoaderReducer.getProcessing);
export const getProcessingSuccess = createSelector(selectPricingLoaderState, fromPricingLoaderReducer.getProcessingSuccess);
export const getProcessingError = createSelector(selectPricingLoaderState, fromPricingLoaderReducer.getProcessingError);
export const getErrorMessage = createSelector(selectPricingLoaderState, fromPricingLoaderReducer.getErrorMessage);
export const getSavingConfigGroupSuccess = createSelector(selectPricingLoaderState, fromPricingLoaderReducer.getSavingConfigGroupSuccess);

// Upload Pricing File
export const getWorksheetNames = createSelector(selectUploadPricingFileState, fromUploadPricingFileReducer.getWorksheetNames);
export const getFileUploadSettings = createSelector(selectUploadPricingFileState, fromUploadPricingFileReducer.getFileUploadSettings);
export const getPricingsSheetName = createSelector(selectUploadPricingFileState, fromUploadPricingFileReducer.getPricingsSheetName);
export const getPricingNotesSheetName = createSelector(selectUploadPricingFileState, fromUploadPricingFileReducer.getPricingNotesSheetName);
export const getPricingMatchNotesSheetName = createSelector(selectUploadPricingFileState, fromUploadPricingFileReducer.getPricingMatchNotesSheetName);
export const getValidationOnly = createSelector(selectUploadPricingFileState, fromUploadPricingFileReducer.getValidationOnly);

// Default Settings
export const getDefaultSettings = createSelector(selectDefaultSettingsState, fromDefaultSettingsReducer.getDefaultSettings);
