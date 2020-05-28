import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromMarketDataFeedPageActions from '../actions/market-data-feed-page.actions';
import { MarketDataFeedExport } from '../model';


// Define our feature state
export interface State {
  generatingFeed: boolean;
  generationFailed: boolean;
  feedsAsync: AsyncStateObj<MarketDataFeedExport[]>;
}

// Define our initial state
const initialState: State = {
  generatingFeed: false,
  generationFailed: false,
  feedsAsync: generateDefaultAsyncStateObj<MarketDataFeedExport[]>([])
};

// Reducer function
export function reducer(state = initialState, action: fromMarketDataFeedPageActions.Actions): State {
  switch (action.type) {
    case fromMarketDataFeedPageActions.GENERATE_FEED: {
      return {
        ...state,
        generatingFeed: true,
        generationFailed: false
      };
    }
    case fromMarketDataFeedPageActions.GENERATE_FEED_SUCCESS: {
      return {
        ...state,
        generatingFeed: false
      };
    }
    case fromMarketDataFeedPageActions.GENERATE_FEED_ERROR: {
      return {
        ...state,
        generatingFeed: false,
        generationFailed: true
      };
    }
    case fromMarketDataFeedPageActions.GET_FEEDS: {
      const asyncStateObjClone: AsyncStateObj<MarketDataFeedExport[]> = cloneDeep(state.feedsAsync);
      asyncStateObjClone.loading = true;
      asyncStateObjClone.loadingError = false;
      return {
        ...state,
        feedsAsync: asyncStateObjClone
      };
    }
    case fromMarketDataFeedPageActions.GET_FEEDS_SUCCESS: {
      const asyncStateObjClone: AsyncStateObj<MarketDataFeedExport[]> = cloneDeep(state.feedsAsync);
      asyncStateObjClone.loading = false;
      asyncStateObjClone.obj = action.payload;
      return {
        ...state,
        feedsAsync: asyncStateObjClone
      };
    }
    case fromMarketDataFeedPageActions.GET_FEEDS_ERROR: {
      const asyncStateObjClone: AsyncStateObj<MarketDataFeedExport[]> = cloneDeep(state.feedsAsync);
      asyncStateObjClone.loading = false;
      asyncStateObjClone.loadingError = true;
      return {
        ...state,
        feedsAsync: asyncStateObjClone
      };
    }
    default: {
      return state;
    }
  }
}
// Selector functions
export const getGeneratingFeed = (state: State) => state.generatingFeed;
export const getFeeds = (state: State) => state.feedsAsync;
