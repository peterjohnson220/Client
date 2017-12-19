import { Exchange } from 'libs/models';

import * as fromManageExchangeActions from '../actions/manage-exchange.actions';

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
  action: fromManageExchangeActions.Actions
): State {
  switch (action.type) {
    case fromManageExchangeActions.LOADING_EXCHANGE: {
      return {
        exchange: null,
        loading: true,
        loadingError: false
      };
    }
    case fromManageExchangeActions.LOADING_EXCHANGE_SUCCESS: {
      return {
        ...state,
        exchange: action.payload,
        loading: false
      };
    }
    case fromManageExchangeActions.LOADING_EXCHANGE_ERROR: {
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
