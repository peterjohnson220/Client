import { combineReducers } from '@ngrx/store';

import { ExchangeRequestTypeEnum } from 'libs/models/peer';

import * as fromExchangeRequestActions from '../actions/exchange-request.actions';
import { ExchangeRequestActions } from '../actions/exchange-request.actions';

export interface IFeatureExchangeRequestState<T> {
  feature: T;
  exchangeRequest: IExchangeRequestState;
}

export interface IExchangeRequestState {
  modalOpen: boolean;
  requesting: boolean;
  requestingError: boolean;
  selectedCandidate: any;
  searchTerm: string;
  filterOptions: any;
}

export const initialExchangeRequestState: IExchangeRequestState = {
  modalOpen: false,
  requesting: false,
  requestingError: false,
  selectedCandidate: null,
  searchTerm: '',
  filterOptions: null
};

const getExchangeRequestReducer = (
  exchangeRequestType: ExchangeRequestTypeEnum,
  initialState: IExchangeRequestState = initialExchangeRequestState
) => {
  return (state = initialState, action: ExchangeRequestActions): IExchangeRequestState => {
    switch (action.type) {
      case `${exchangeRequestType}_${fromExchangeRequestActions.OPEN_EXCHANGE_REQUEST_MODAL}`: {
        return {
          ...state,
          modalOpen: true
        };
      }
      case `${exchangeRequestType}_${fromExchangeRequestActions.CLOSE_EXCHANGE_REQUEST_MODAL}`: {
        return {
          ...initialExchangeRequestState
        };
      }
      case `${exchangeRequestType}_${fromExchangeRequestActions.CREATE_EXCHANGE_REQUEST}`: {
        return {
          ...state,
          requesting: true
        };
      }
      case `${exchangeRequestType}_${fromExchangeRequestActions.CREATE_EXCHANGE_REQUEST_SUCCESS}`: {
        return {
          ...state,
          modalOpen: false,
          requesting: false
        };
      }
      case `${exchangeRequestType}_${fromExchangeRequestActions.CREATE_EXCHANGE_REQUEST_ERROR}`: {
        return {
          ...state,
          requesting: false,
          requestingError: true
        };
      }
      case `${exchangeRequestType}_${fromExchangeRequestActions.UPDATE_SELECTION}`: {
        return {
          ...state,
          selectedCandidate: action.payload
        };
      }
      case `${exchangeRequestType}_${fromExchangeRequestActions.UPDATE_SEARCH_TERM}`: {
        return {
          ...state,
          searchTerm: action.payload
        };
      }
      case `${exchangeRequestType}_${fromExchangeRequestActions.UPDATE_FILTER_OPTIONS}`: {
        return {
          ...state,
          filterOptions: action.payload
        };
      }
      case `${exchangeRequestType}_${fromExchangeRequestActions.RESET_EXCHANGE_REQUEST}`: {
        return {
          ...state,
          selectedCandidate: null,
          searchTerm: '',
          filterOptions: null
        };
      }
      default: {
        return state;
      }
    }
  };
};

export const createExchangeRequestReducer = (
  exchangeRequestType: ExchangeRequestTypeEnum,
  featureReducer: any,
  exchangeRequestOverride?: any
) => {
  return combineReducers({
    feature: featureReducer,
    exchangeRequest: getExchangeRequestReducer(exchangeRequestType, initialExchangeRequestState)
  });
};

// Selector Functions
export const getExchangeRequestState = (state: IExchangeRequestState) => state;
export const getExchangeRequestModalOpen = (state: IExchangeRequestState) => state.modalOpen;

// TODO: Consolidate 'searchTerm' vs 'query'
export const getQuery = (state: IExchangeRequestState) => state.searchTerm;
