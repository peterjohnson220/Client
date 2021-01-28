import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromMarketingSettingsReducer from './marketing-settings.reducer';

// Feature area state
export interface MarketingSettingsState {
  marketingSettings: fromMarketingSettingsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_marketing_settings: MarketingSettingsState;
}

// Feature area reducers
export const reducers = {
  marketingSettings: fromMarketingSettingsReducer.reducer
};

// Select Feature Area
export const selectMarketingSettingsFeature =
  createFeatureSelector<MarketingSettingsState>('feature_marketing_settings');

// View Selectors
export const selectMarketingSettingsState =
  createSelector(selectMarketingSettingsFeature, (state: MarketingSettingsState) => state.marketingSettings);

// Marketing Settings
export const getGettingMarketingImage = createSelector(selectMarketingSettingsState, fromMarketingSettingsReducer.getGettingMarketingImage);
export const getGettingMarketingImageError = createSelector(selectMarketingSettingsState, fromMarketingSettingsReducer.getGettingMarketingImageError);
export const getGettingMarketingImageSuccess = createSelector(selectMarketingSettingsState, fromMarketingSettingsReducer.getGettingMarketingImageSuccess);
export const getMarketingImage = createSelector(selectMarketingSettingsState, fromMarketingSettingsReducer.getMarketingImage);
export const getUpdatingMarketingSettings = createSelector(selectMarketingSettingsState, fromMarketingSettingsReducer.getUpdatingMarketingSettings);
export const getUpdatingMarketingSettingsSuccess =
  createSelector(selectMarketingSettingsState, fromMarketingSettingsReducer.getUpdatingMarketingSettingsSuccess);
export const getUpdatingMarketingSettingsError = createSelector(selectMarketingSettingsState, fromMarketingSettingsReducer.getUpdatingMarketingSettingsError);
export const getGettingMarketingVideoUrl = createSelector(selectMarketingSettingsState, fromMarketingSettingsReducer.getGettingMarketingVideoUrl);
export const getGettingMarketingVideoUrlError = createSelector(selectMarketingSettingsState, fromMarketingSettingsReducer.getGettingMarketingVideoUrlError);
export const getGettingMarketingVideoUrlSuccess = createSelector(selectMarketingSettingsState, fromMarketingSettingsReducer.getGettingMarketingVideoUrlSuccess);
export const getMarketingVideoUrl = createSelector(selectMarketingSettingsState, fromMarketingSettingsReducer.getMarketingVideoUrl);

