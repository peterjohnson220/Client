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
  hideAddPaymarketsButton: boolean;
  displayNationalAsCard: boolean;
}

const initialState: State = {
  paymarkets: [],
  loadingPaymarkets: false,
  loadingPaymarketsError: false,
  paymarketsFilter: null,
  selectedPaymarket: MarketsCardHelper.buildDefaultPricingPayMarket(),
  marketDataScope: null,
  hideAddPaymarketsButton: false,
  displayNationalAsCard: false
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
    case fromMarketsCardActions.SET_TO_DEFAULT_PAYMARKET: {
      return {
        ...state,
        selectedPaymarket: MarketsCardHelper.buildDefaultPricingPayMarket()
      };
    }
    case fromMarketsCardActions.GET_MD_SCOPE_SUCCESS:
      return {
        ...state,
        marketDataScope: PayfactorsApiModelMapper.mapMDScopeResponseToMarketDataScope(
          action.payload.response, action.payload.countryDataSet)
      };
    case fromMarketsCardActions.GET_MD_SCOPE_ERROR:
      return {
        ...state,
        marketDataScope: MarketsCardHelper.buildDefaultMarketDataScope()
      };
    case fromMarketsCardActions.ORDER_PAYMARKETS_WITH_SELECTED_FIRST:
      let newPayMarkets;
      const selectedPayMarket = state.selectedPaymarket;
      const allPayMarketsWithoutSelected = sortPaymarkets(state.paymarkets
        .filter(pm => pm.CompanyPayMarketId !== selectedPayMarket.CompanyPayMarketId));

      // Don't add Default unless specified
      if (selectedPayMarket.CompanyPayMarketId || state.displayNationalAsCard) {
        newPayMarkets = [selectedPayMarket, ...allPayMarketsWithoutSelected];
      } else {
        newPayMarkets = allPayMarketsWithoutSelected;
      }

      return {
        ...state,
        paymarkets: newPayMarkets
      };
    case fromMarketsCardActions.HIDE_ADD_NEW_PAYMARKETS_BUTTON: {
      return {
        ...state,
        hideAddPaymarketsButton: true
      };
    }
    case fromMarketsCardActions.DISPLAY_NATIONAL_AS_CARD: {
      return {
        ...state,
        displayNationalAsCard: true
      };
    }
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
export const getHideNewPaymarketsButton = (state: State) => state.hideAddPaymarketsButton;
