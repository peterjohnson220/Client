import * as cloneDeep from 'lodash.clonedeep';

import * as fromMarketDataFeedPageActions from '../actions/market-data-feed-page.actions';

// Define our feature state
export interface State {
  generatingFeed: boolean;
}

// Define our initial state
const initialState: State = {
  generatingFeed: false
};

// Reducer function
export function reducer(state = initialState, action: fromMarketDataFeedPageActions.Actions): State {
  switch (action.type) {
    case fromMarketDataFeedPageActions.GENERATE_FEED: {
      return {
        ...state
      };
    }
    case fromMarketDataFeedPageActions.GENERATE_FEED_SUCCESS: {
      return {
        ...state
      };
    }
    case fromMarketDataFeedPageActions.GENERATE_FEED_ERROR: {
      return {
        ...state
      };
    }
    default: {
      return state;
    }
  }
}
