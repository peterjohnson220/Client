import { Exchange } from 'libs/models';

import * as fromExchangeActions from '../actions/exchange.actions';

export interface State {
  loading: boolean;
  loadingError: boolean;
  exchange: Exchange;
}

// Initial State
export const initialState: State = {
  loading: false,
  loadingError: false,
  exchange: null
};


// Reducer
export function reducer(
  state = initialState,
  action: fromExchangeActions.Actions
): State {
  switch (action.type) {
    case fromExchangeActions.LOAD_EXCHANGE: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromExchangeActions.LOAD_EXCHANGE_SUCCESS: {
      return {
        ...state,
        exchange: action.payload.exchange,
        loading: false
      };
    }
    case fromExchangeActions.LOAD_EXCHANGE_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getExchange = (state: State) => state.exchange;
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
