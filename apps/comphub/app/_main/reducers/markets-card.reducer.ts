import * as cloneDeep from 'lodash.clonedeep';

import * as fromMarketsCardActions from '../actions/markets-card.actions';
import { PricingPaymarket, MarketDataScope } from '../models';
import { PayfactorsApiModelMapper, MarketsCardHelper } from '../helpers';

export interface State {
  paymarkets: PricingPaymarket[];
  loadingPaymarkets: boolean;
  loadingPaymarketsError: boolean;
  paymarketsFilter: string;
  selectedPaymarket: PricingPaymarket;
  marketDataScope: MarketDataScope;
}

const initialState: State = {
  paymarkets: [],
  loadingPaymarkets: false,
  loadingPaymarketsError: false,
  paymarketsFilter: null,
  selectedPaymarket: MarketsCardHelper.buildDefaultPricingPayMarket(),
  marketDataScope: null
};

// Reducer function
export function reducer(state = initialState, action: fromMarketsCardActions.Actions): State {
  switch (action.type) {

    case fromMarketsCardActions.GET_PAYMARKETS: {
      return {
        ...state,
        loadingPaymarkets: true
      };
    }
    case fromMarketsCardActions.GET_PAYMARKETS_SUCCESS: {
      const paymarkets = cloneDeep(action.payload);
      sortPaymarkets(paymarkets);
      return {
        ...state,
        loadingPaymarkets: false,
        loadingPaymarketsError: false,
        paymarkets: paymarkets
      };
    }
    case fromMarketsCardActions.GET_PAYMARKETS_ERROR: {
      return {
        ...state,
        loadingPaymarkets: false,
        loadingPaymarketsError: true
      };
    }
    case fromMarketsCardActions.SET_PAYMARKET_FILTER: {
      return {
        ...state,
        paymarketsFilter: action.payload
      };
    }
    case fromMarketsCardActions.SET_SELECTED_PAYMARKET: {
      let selectedPaymarket = action.payload;

      // Replace with default if deselecting
      if (action.payload.CompanyPayMarketId === state.selectedPaymarket.CompanyPayMarketId) {
        selectedPaymarket = MarketsCardHelper.buildDefaultPricingPayMarket();
      }

      return {
        ...state,
        selectedPaymarket: selectedPaymarket
      };
    }

    case fromMarketsCardActions.GET_MD_SCOPE_SUCCESS:
      return {
        ...state,
        marketDataScope: PayfactorsApiModelMapper.mapMDScopeResponseToMarketDataScope(action.payload)
      };

    case fromMarketsCardActions.GET_MD_SCOPE_ERROR:
      return {
        ...state,
        marketDataScope: MarketsCardHelper.buildDefaultMarketDataScope()
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
