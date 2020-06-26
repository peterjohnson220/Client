import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducers
import * as fromRoot from 'libs/state/state';

import * as fromMarketDataFeedPageReducer from './market-data-feed-page.reducer';

// Feature area state
export interface MarketDataFeedMainState {
  marketDataFeedPage: fromMarketDataFeedPageReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  marketDataFeed_main: MarketDataFeedMainState;
}

// Feature area reducers
export const reducers = {
  marketDataFeedPage: fromMarketDataFeedPageReducer.reducer,
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<MarketDataFeedMainState>('marketDataFeed_main');

// Feature Selectors
export const selectMarketDataFeedPageState = createSelector(
  selectFeatureAreaState,
  (state: MarketDataFeedMainState) => state.marketDataFeedPage
);

// Market Data Feed Page
export const getGeneratingFeed = createSelector(selectMarketDataFeedPageState,  fromMarketDataFeedPageReducer.getGeneratingFeed);
export const getFeeds = createSelector(selectMarketDataFeedPageState,  fromMarketDataFeedPageReducer.getFeeds);
