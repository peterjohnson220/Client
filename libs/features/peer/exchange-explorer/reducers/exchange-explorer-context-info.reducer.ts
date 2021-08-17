import * as fromExchangeExplorerContextInfoActions from '../actions/exchange-explorer-context-info.actions';

import { SearchFilterMappingDataObj } from '../../../search/search/models';
import { ExchangeJobExchangeDetail } from '../../models';
import { MapGeoData } from '../../../../models/peer';
import { PayMarket } from '../../../../models/paymarket';

// Extended entity state
export interface State {
  loading: boolean;
  loadingError: boolean;

  payMarket: PayMarket;
  payMarketGeoData: MapGeoData;
  exchangeJobFilterOptions: ExchangeJobExchangeDetail[];
  searchFilterMappingDataObj: SearchFilterMappingDataObj;
  includeDisabledFilters: boolean;
  includeCurrentCompany: boolean;

  // TODO: Currently not using these but may be a good place for them at some point.
  companyJobId: number;
  companyPayMarketId: number;
}

// Initial State
export const initialState: State = {
  loading: false,
  loadingError: false,

  payMarket: null,
  payMarketGeoData: null,
  exchangeJobFilterOptions: [],
  searchFilterMappingDataObj: {},
  includeDisabledFilters: false,
  includeCurrentCompany: false,
  companyJobId: 0,
  companyPayMarketId: 0
};

export let initialLoadCompleteState: State = null;

// Reducer
export function reducer(state = initialState, action: fromExchangeExplorerContextInfoActions.Actions): State {
  switch (action.type) {
    case fromExchangeExplorerContextInfoActions.LOAD_CONTEXT_INFO: {
      return {
        ...state,
        loading: true
      };
    }
    case fromExchangeExplorerContextInfoActions.LOAD_CONTEXT_INFO_SUCCESS: {
      const payload = action.payload;
      const newState = {
        ...state,
        loading: false,
        payMarket: payload.payMarket,
        payMarketGeoData: payload.payMarketGeoData,
        exchangeJobFilterOptions: payload.exchangeJobFilterOptions,
        searchFilterMappingDataObj: payload.searchFilterMappingDataObj,
        includeDisabledFilters: payload.includeDisabledFilters,
        includeCurrentCompany: payload.includeCurrentCompany
      };

      if (!initialLoadCompleteState) {
        initialLoadCompleteState = newState;
      }

      return newState;
    }
    case fromExchangeExplorerContextInfoActions.LOAD_CONTEXT_INFO_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromExchangeExplorerContextInfoActions.REFRESH_PAYMARKET_CONTEXT: {
      return {
        ...state,
        loading: true
      };
    }
    case fromExchangeExplorerContextInfoActions.REFRESH_PAYMARKET_CONTEXT_SUCCESS: {
      const payload = action.payload;

      return {
        ...state,
        loading: false,
        payMarket: payload.payMarket,
        payMarketGeoData: payload.payMarketGeoData,
      };
    }
    case fromExchangeExplorerContextInfoActions.REFRESH_PAYMARKET_CONTEXT_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromExchangeExplorerContextInfoActions.RESET_INITIALLY_LOADED_STATE: {
      return !!initialLoadCompleteState ? {...initialLoadCompleteState} : {...state};
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getPayMarket = (state: State) => state.payMarket;
export const getPayMarketGeoData = (state: State) => state.payMarketGeoData;
export const getExchangeJobFilterOptions = (state: State) => state.exchangeJobFilterOptions;
export const getSearchFilterMappingDataObj = (state: State) => state.searchFilterMappingDataObj;
export const getIncludeDisabledFilters = (state: State) => state.includeDisabledFilters;
export const getIncludeCurrentCompany = (state: State) => state.includeCurrentCompany;
