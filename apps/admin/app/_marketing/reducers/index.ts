import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromMarketingReducer from './marketing-image.reducer';

// Feature area state
export interface MarketingState {
  marketingImage: fromMarketingReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  marketing: MarketingState;
}

// Feature area reducers
export const reducers = {
  marketingImage: fromMarketingReducer.reducer
};

// Select Feature Area
export const selectMarketingState = createFeatureSelector<MarketingState>('marketing');

// Marketing Image
export const getMarketingState =
  createSelector(selectMarketingState, (state: MarketingState) => state.marketingImage);

export const getMarketingImage =
  createSelector(getMarketingState, fromMarketingReducer.getMarketingImage);
export const getGettingMarketingImage =
  createSelector(getMarketingState, fromMarketingReducer.getGettingMarketingImage);
export const getGettingMarketingImageError =
  createSelector(getMarketingState, fromMarketingReducer.getGettingMarketingImageError);
export const getGettingMarketingImageSuccess =
  createSelector(getMarketingState, fromMarketingReducer.getGettingMarketingImageSuccess);
