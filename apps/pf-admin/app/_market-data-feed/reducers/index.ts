import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducers
import * as fromRoot from 'libs/state/state';

import * as fromMarketDataFeedPageReducer from './market-data-feed-page.reducer';

// Feature area state
export interface MarketDataFeedPageMainState {
  marketDataFeedPage: fromMarketDataFeedPageReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  userSettings_main: MarketDataFeedPageMainState;
}

// Feature area reducers
export const reducers = {
  userSettingsPage: fromMarketDataFeedPageReducer.reducer,
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<MarketDataFeedPageMainState>('marketDataFeedPage_main');

// Feature Selectors
export const selectMarketDataFeedPageState = createSelector(selectFeatureAreaState,
  (state: MarketDataFeedPageMainState) => state.marketDataFeedPage
);

// Market Data Feed Page

