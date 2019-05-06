import { Exchange } from 'libs/models';

import * as fromExchangeActions from '../actions/exchange.actions';
import { ExchangeManagementDetails } from '../models';

export interface State {
  loading: boolean;
  loadingError: boolean;
  exchange: Exchange;
  isSystemExchange: boolean;
  companyCount: number;
  exchangeStatusConfirmationModalOpen: boolean;
  updating: boolean;
  updatingError: boolean;
}

// Initial State
export const initialState: State = {
  loading: false,
  loadingError: false,
  exchange: null,
  isSystemExchange: false,
  companyCount: 0,
  exchangeStatusConfirmationModalOpen: false,
  updating: false,
  updatingError: false
};

// Reducer
export function reducer(
  state = initialState,
  action: fromExchangeActions.Actions
): State {
  switch (action.type) {
    case fromExchangeActions.LOAD_EXCHANGE_MANAGEMENT_DETAILS: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromExchangeActions.LOAD_EXCHANGE_MANAGEMENT_DETAILS_SUCCESS: {
      const exchangeManagementDetails: ExchangeManagementDetails = action.payload;
      return {
        ...state,
        exchange: exchangeManagementDetails.Exchange,
        isSystemExchange: exchangeManagementDetails.IsSystemExchange,
        companyCount: exchangeManagementDetails.CompanyCount,
        loading: false
      };
    }
    case fromExchangeActions.LOAD_EXCHANGE_MANAGEMENT_DETAILS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromExchangeActions.OPEN_TOGGLE_EXCHANGE_STATUS_MODAL: {
      return {
        ...state,
        exchangeStatusConfirmationModalOpen: true
      };
    }
    case fromExchangeActions.CLOSE_TOGGLE_EXCHANGE_STATUS_MODAL: {
      return {
        ...state,
        exchangeStatusConfirmationModalOpen: false
      };
    }
    case fromExchangeActions.UPDATE_EXCHANGE_STATUS: {
      return {
        ...state,
        updating: true,
        updatingError: false
      };
    }
    case fromExchangeActions.UPDATE_EXCHANGE_STATUS_SUCCESS: {
      return {
        ...state,
        exchange: action.payload,
        updating: false,
        updatingError: false,
        exchangeStatusConfirmationModalOpen: false
      };
    }
    case fromExchangeActions.UPDATE_EXCHANGE_STATUS_ERROR: {
      return {
        ...state,
        updating: false,
        updatingError: true
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
export const getExchangeStatusConfirmationModalOpen = (state: State) => state.exchangeStatusConfirmationModalOpen;
export const getExchangeUpdating = (state: State) => state.updating;
export const getExchangeUpdatingError = (state: State) => state.updatingError;
export const getCanActivateExchange = (state: State) => state.companyCount >= 6 && !state.isSystemExchange;
