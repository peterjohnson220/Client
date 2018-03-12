import { EntityState } from '@ngrx/entity';
import { combineReducers } from '@ngrx/store';

import * as fromExchangeRequestActions from '../actions/exchange-request.actions';
import { ExchangeRequestActions, ExchangeRequestTypeEnum } from '../actions/exchange-request.actions';

export interface IFeatureExchangeRequestState<T> extends EntityState<T> {
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
          ...state,
          modalOpen: false
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
    grid: getExchangeRequestReducer(exchangeRequestType, initialExchangeRequestState)
  });
};

// Selector Functions
export const getExchangeRequestState = (state: IExchangeRequestState) => state;
