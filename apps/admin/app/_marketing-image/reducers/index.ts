import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as marketingImageReducer from './marketing-image.reducer';

// Feature area state
export interface MarketingMainState {
  marketingImage: marketingImageReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  marketingMain: MarketingMainState;
}

// Feature area reducers
export const reducers = {
  marketingImage: marketingImageReducer.reducer,
};

// Select Feature Area
export const selectMarketingMainState = createFeatureSelector<MarketingMainState>('marketingMain');
export const marketingImageState = createSelector(selectMarketingMainState, (state: MarketingMainState) => state.marketingImage);

export const getSavingMarketingImageFile = createSelector(marketingImageState, marketingImageReducer.getSavingFile);
export const getSavingMarketingImageFileSuccess = createSelector(marketingImageState, marketingImageReducer.getSavingFileSuccess);
export const getSavingMarketingImageFileError = createSelector(marketingImageState, marketingImageReducer.getSavingFileError);
export const getMarketingImageFile = createSelector(marketingImageState, marketingImageReducer.getImageFile);
export const hasMarketingImageFile = createSelector(marketingImageState, marketingImageReducer.hasImageFile);


