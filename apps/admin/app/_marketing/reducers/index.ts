import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromMarketingReducer from 'libs/features/marketing-settings/marketing-settings.reducer';

// Feature area state
export interface MarketingSettingsState {
  marketingSettings: fromMarketingReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  marketingMain: MarketingSettingsState;
}

// Feature area reducers
export const reducers = {
  marketingSettings: fromMarketingReducer.reducer
};

// Select Feature Area
export const selectAuthMainState = createFeatureSelector<MarketingSettingsState>('marketingMain');


// marketing settings
export const getMarketingState =
  createSelector(selectAuthMainState, (state: MarketingSettingsState) => state.marketingSettings);

export const updatingMarketingSettings =
  createSelector(getMarketingState, fromMarketingReducer.getUpdatingMarketingSettings);
export const updatingMarketingSettingsSuccess =
  createSelector(getMarketingState, fromMarketingReducer.getUpdatingMarketingSettingsSuccess);
export const updatingMarketingSettingsError =
  createSelector(getMarketingState, fromMarketingReducer.getUpdatingMarketingSettingsError);

export const getMarketingVideoUrl =
  createSelector(getMarketingState, fromMarketingReducer.getMarketingVideoUrl);
export const getMarketingImage =
  createSelector(getMarketingState, fromMarketingReducer.getMarketingImage);
