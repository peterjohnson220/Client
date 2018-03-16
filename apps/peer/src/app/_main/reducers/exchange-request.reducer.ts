import { EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeRequestTypeEnum } from 'libs/models/peer';

import * as fromExchangeRequestActions from '../actions/exchange-request.actions';
import { ExchangeRequestActions } from '../actions/exchange-request.actions';

export interface IExchangeRequestState {
  loading: boolean;
  loadingError: boolean;
  modalOpen: boolean;
  requesting: boolean;
  requestingError: boolean;
  selectedCandidate: any;
  searchTerm: string;
  filterOptions: any;
}
export interface IExchangeRequestEntityState<T> extends EntityState<T>, IExchangeRequestState { }

const initialExchangeRequestState: IExchangeRequestState = {
  loading: false,
  loadingError: false,
  modalOpen: false,
  requesting: false,
  requestingError: false,
  selectedCandidate: null,
  searchTerm: '',
  filterOptions: null
};

function getExchangeRequestReducer<T> (
  exchangeRequestType: ExchangeRequestTypeEnum,
  entityAdapter: EntityAdapter<T>,
  initialState: IExchangeRequestState = initialExchangeRequestState
) {
  const initState: IExchangeRequestEntityState<T> = entityAdapter.getInitialState(initialState);
  return (state: any = initState, action: ExchangeRequestActions): IExchangeRequestEntityState<T> => {
    switch (action.type) {
      case `${exchangeRequestType}_${fromExchangeRequestActions.LOAD_CANDIDATES}`: {
        return {
          ...entityAdapter.removeAll(state),
          loading: true,
          loadingError: false
        };
      }
      case `${exchangeRequestType}_${fromExchangeRequestActions.LOAD_CANDIDATES_SUCCESS}`: {
        return {
          ...entityAdapter.addAll(action.payload, state),
          loading: false,
        };
      }
      case `${exchangeRequestType}_${fromExchangeRequestActions.LOAD_CANDIDATES_ERROR}`: {
        return {
          ...state,
          loading: false,
          loadingError: true
        };
      }
      case `${exchangeRequestType}_${fromExchangeRequestActions.OPEN_EXCHANGE_REQUEST_MODAL}`: {
        return {
          ...state,
          modalOpen: true
        };
      }
      case `${exchangeRequestType}_${fromExchangeRequestActions.CLOSE_EXCHANGE_REQUEST_MODAL}`: {
        return {
          ...initState
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
}

export function createExchangeRequestReducer<T> (
  exchangeRequestType: ExchangeRequestTypeEnum,
  entityAdapter: EntityAdapter<T>,
  exchangeRequestOverride?: any
) {
  return getExchangeRequestReducer<T>(exchangeRequestType, entityAdapter, initialExchangeRequestState);
}

// Selector Functions

// Selector functions
export const getLoading = (state: IExchangeRequestState) => state.loading;
export const getLoadingError = (state: IExchangeRequestState) => state.loadingError;
export const getModalOpen = (state: IExchangeRequestState) => state.modalOpen;
export const getRequesting = (state: IExchangeRequestState) => state.requesting;
export const getRequestingError = (state: IExchangeRequestState) => state.requestingError;
export const getSelectedCandidate = (state: IExchangeRequestState) => state.selectedCandidate;
export const getLoadingRequestContext = (state: IExchangeRequestState) => {
  return {
    ...state.filterOptions,
    query: state.searchTerm
  };
};

// TODO: Consolidate 'searchTerm' vs 'query'
export const getQuery = (state: IExchangeRequestState) => state.searchTerm;
