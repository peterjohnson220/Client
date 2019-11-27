import * as fromExchangeExplorerContextInfoActions from '../actions/exchange-explorer-context-info.actions';
import { PayMarket } from '../../../../models/paymarket';
import { SearchFilterMappingDataObj } from '../../../search/models';
import { ExchangeJobExchangeDetail } from '../../models';

// Extended entity state
export interface State {
  loading: boolean;
  loadingError: boolean;

  payMarket: PayMarket;
  exchangeJobFilterOptions: ExchangeJobExchangeDetail[];
  searchFilterMappingDataObj: SearchFilterMappingDataObj;

  // TODO: Currently not using these but may be a good place for them at some point.
  companyJobId: number;
  companyPayMarketId: number;
}

// Initial State
export const initialState: State = {
  loading: false,
  loadingError: false,

  payMarket: null,
  exchangeJobFilterOptions: [],
  searchFilterMappingDataObj: {},

  companyJobId: 0,
  companyPayMarketId: 0
};

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

      return {
        ...state,
        loading: false,
        payMarket: payload.payMarket,
        exchangeJobFilterOptions: payload.exchangeJobFilterOptions,
        searchFilterMappingDataObj: payload.searchFilterMappingDataObj
      };
    }
    case fromExchangeExplorerContextInfoActions.LOAD_CONTEXT_INFO_ERROR: {
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
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getPayMarket = (state: State) => state.payMarket;
export const getExchangeJobFilterOptions = (state: State) => state.exchangeJobFilterOptions;
export const getSearchFilterMappingDataObj = (state: State) => state.searchFilterMappingDataObj;
