import cloneDeep from 'lodash/cloneDeep';

import { JobPayMarket } from 'libs/features/add-jobs/models';

import * as fromPaymarketsActions from '../actions/paymarkets.actions';

export interface State {
  paymarkets: JobPayMarket[];
  loadingPaymarkets: boolean;
  loadingPaymarketsError: boolean;
  defaultPaymarketId?: number;
  searchTerm: string;
}

const initialState: State = {
  loadingPaymarkets: false,
  loadingPaymarketsError: false,
  paymarkets: [],
  defaultPaymarketId: null,
  searchTerm: null
};

// Reducer function
export function reducer(state = initialState, action: fromPaymarketsActions.Actions): State {
  switch (action.type) {

    case fromPaymarketsActions.LOAD_PAYMARKETS_SUCCESS: {
      const defaultPaymarketId = state.defaultPaymarketId;
      let paymarkets = cloneDeep(action.payload);
      paymarkets = sortPaymarkets(paymarkets, defaultPaymarketId);
      const defaultPaymarket = paymarkets.find(p => p.CompanyPayMarketId === defaultPaymarketId);
      if (defaultPaymarket) {
        defaultPaymarket.IsSelected = true;
      }
      return {
        ...state,
        paymarkets: paymarkets,
        loadingPaymarkets: false,
        loadingPaymarketsError: false
      };
    }
    case fromPaymarketsActions.LOAD_PAYMARKETS: {
      return {
        ...state,
        loadingPaymarkets: true,
        loadingPaymarketsError: false
      };
    }
    case fromPaymarketsActions.LOAD_PAYMARKETS_ERROR: {
      return {
        ...state,
        loadingPaymarkets: false,
        loadingPaymarketsError: true
      };
    }
    case fromPaymarketsActions.TOGGLE_PAYMARKET_SELECTION: {
      const selectedPaymarketId = action.payload;
      const paymarketsCopy =  cloneDeep(state.paymarkets);
      const paymarket = paymarketsCopy.find(p => p.CompanyPayMarketId === selectedPaymarketId);
      if (paymarket) {
        paymarket.IsSelected = !paymarket.IsSelected;
      }
      return {
        ...state,
        paymarkets: paymarketsCopy
      };
    }
    case fromPaymarketsActions.SET_DEFAULT_PAYMARKET: {
      return {
        ...state,
        defaultPaymarketId: action.payload
      };
    }
    case fromPaymarketsActions.CLEAR_PAYMARKETS: {
      return {
        ...state,
        searchTerm: null,
        paymarkets: []
      };
    }
    case fromPaymarketsActions.SET_SEARCH_TERM: {
      const paymarketsCopy =  cloneDeep(state.paymarkets);
      paymarketsCopy.map(p => p.IsHidden = shouldHide(p, action.payload));
      return {
        ...state,
        searchTerm: action.payload,
        paymarkets: paymarketsCopy
      };
    }
    case fromPaymarketsActions.RESET_PAYMARKET_SELECTIONS: {
      const resetPayMarkets = cloneDeep(state.paymarkets).map(pm => {
        pm.IsSelected = pm.CompanyPayMarketId === state.defaultPaymarketId;
        return pm;
      });

      return {
        ...state,
        paymarkets: resetPayMarkets
      };
    }
    default: {
      return state;
    }
  }
}
function sortPaymarkets(paymarkets, defaultPaymarket) {
  paymarkets.sort(function (a, b) {
    if (a.CompanyPayMarketId === defaultPaymarket) {
      return -1;
    }
    if (b.CompanyPayMarketId === defaultPaymarket) {
      return 1;
    }
    const x = a.PayMarket.toLowerCase();
    const y = b.PayMarket.toLowerCase();
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

function shouldHide(paymarket: JobPayMarket, filterString: string): boolean {
  if (!filterString) {
    return false;
  }
  return paymarket.PayMarket === null || paymarket.PayMarket.toLowerCase().indexOf(filterString.toLowerCase()) === -1;
}
// Selector functions
export const getPaymarkets = (state: State) => state.paymarkets;
export const getDefaultPaymarket = (state: State) => state.defaultPaymarketId;
export const getLoadingPaymarkets = (state: State) => state.loadingPaymarkets;
export const getLoadingPaymarketsError = (state: State) => state.loadingPaymarketsError;
export const getSearchTerm = (state: State) => state.searchTerm;
