import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromUploadPricingFileReducer from './upload-pricing-file.reducer';

// Feature area state
export interface PricingLoaderMainState {
  uploadPricingFile: fromUploadPricingFileReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  pricingloader_main: PricingLoaderMainState;
}

// Feature area reducers
export const reducers = {
  uploadPricingFile: fromUploadPricingFileReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<PricingLoaderMainState>('pricingloader_main');

// Feature Selectors
export const selectUploadPricingFileState = createSelector(
  selectFeatureAreaState,
  (state: PricingLoaderMainState) => state.uploadPricingFile
);

// Upload Pricing File
export const getWorksheetNames = createSelector(selectUploadPricingFileState, fromUploadPricingFileReducer.getWorksheetNames);
