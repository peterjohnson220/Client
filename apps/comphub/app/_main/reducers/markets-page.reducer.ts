import * as cloneDeep from 'lodash.clonedeep';

import * as fromMarketsPageActions from '../actions/markets-page.actions';
import { PricingPaymarket, MarketDataScope } from '../models';
import { PayfactorsApiModelMapper, MarketsPageHelper } from '../helpers';

export interface State {
  paymarkets: PricingPaymarket[];
  loadingPaymarkets: boolean;
  loadingPaymarketsError: boolean;
  paymarketsFilter: string;
  selectedPaymarket?: number;
  marketDataScope: MarketDataScope;
}

const initialState: State = {
  paymarkets: [],
  loadingPaymarkets: false,
  loadingPaymarketsError: false,
  paymarketsFilter: null,
  selectedPaymarket: null,
  marketDataScope: null
};

// Reducer function
export function reducer(state = initialState, action: fromMarketsPageActions.Actions): State {
  switch (action.type) {

    case fromMarketsPageActions.GET_PAYMARKETS: {
      return {
        ...state,
        loadingPaymarkets: true
      };
    }
    case fromMarketsPageActions.GET_PAYMARKETS_SUCCESS: {
      const paymarkets = cloneDeep(action.payload);
      sortPaymarkets(paymarkets);
      return {
        ...state,
        loadingPaymarkets: false,
        loadingPaymarketsError: false,
        paymarkets: paymarkets
      };
    }
    case fromMarketsPageActions.GET_PAYMARKETS_ERROR: {
      return {
        ...state,
        loadingPaymarkets: false,
        loadingPaymarketsError: true
      };
    }
    case fromMarketsPageActions.SET_PAYMARKET_FILTER: {
      return {
        ...state,
        paymarketsFilter: action.payload
      };
    }
    case fromMarketsPageActions.SET_SELECTED_PAYMARKET: {
      const selectedId = state.selectedPaymarket === action.payload ? null : action.payload;
      return {
        ...state,
        selectedPaymarket: selectedId
      };
    }

    case fromMarketsPageActions.GET_MD_SCOPE_SUCCESS:
      return {
        ...state,
        marketDataScope: PayfactorsApiModelMapper.mapMDScopeResponseToMarketDataScope(action.payload)
      };

    case fromMarketsPageActions.GET_MD_SCOPE_ERROR:
      return {
        ...state,
        marketDataScope: MarketsPageHelper.buildDefaultMarketDataScope()
      };
    default: {
      return state;
    }
  }
}

function sortPaymarkets(paymarkets: PricingPaymarket[]) {
  paymarkets.sort(function (a, b) {
    const x = a.PayMarketName.toLowerCase();
    const y = b.PayMarketName.toLowerCase();
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  });
  return paymarkets;
}

// Selector functions
export const getPaymarkets = (state: State) => state.paymarkets;
export const getLoadingPaymarkets = (state: State) => state.loadingPaymarkets;
export const getLoadingPaymarketsError = (state: State) => state.loadingPaymarketsError;
export const getPaymarketsFilter = (state: State) => state.paymarketsFilter;
export const getSelectedPaymarket = (state: State) => state.selectedPaymarket;
export const getMarketDataScope = (state: State) => state.marketDataScope;
