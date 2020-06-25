import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeListItem } from 'libs/models/index';

import * as fromExchangeListActions from '../actions/exchange-list.actions';

// Extended entity state
export interface State extends EntityState<ExchangeListItem> {
  searchQuery: string;
  loading: boolean;
  loadingError: boolean;
  upserting: boolean;
  upsertingError: boolean;
  upsertingErrorMessage: string;
  createExchangeModalOpen: boolean;
  deleting: boolean;
  deletingError: boolean;
  deleteExchangeModalOpen: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<ExchangeListItem> = createEntityAdapter<ExchangeListItem>({
  selectId: (exchangeListItem: ExchangeListItem) => exchangeListItem.ExchangeId
});


// Initial State
export const initialState: State = adapter.getInitialState({
  searchQuery: '',
  loading: false,
  loadingError: false,
  upserting: false,
  upsertingError: false,
  upsertingErrorMessage: '',
  createExchangeModalOpen: false,
  deleting: false,
  deletingError: false,
  deleteExchangeModalOpen: false
});


// Reducer
export function reducer(
  state = initialState,
  action: fromExchangeListActions.Actions
): State {
  switch (action.type) {
    case fromExchangeListActions.LOAD_EXCHANGES: {
      return {
        ...state,
        searchQuery: action.payload,
        loading: true,
        loadingError: false
      };
    }
    case fromExchangeListActions.LOAD_EXCHANGES_SUCCESS: {
      return {
        ...adapter.setAll(action.payload, state),
        loading: false
      };
    }
    case fromExchangeListActions.LOAD_EXCHANGES_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromExchangeListActions.OPEN_CREATE_EXCHANGE_MODAL: {
      return {
        ...state,
        createExchangeModalOpen: true
      };
    }
    case fromExchangeListActions.CLOSE_CREATE_EXCHANGE_MODAL: {
      return {
        ...state,
        createExchangeModalOpen: false
      };
    }
    case fromExchangeListActions.UPSERT_EXCHANGE: {
      return {
        ...state,
        upserting: true,
        upsertingError: false
      };
    }
    case fromExchangeListActions.UPSERT_EXCHANGE_SUCCESS: {
      const newState = {
        ...state,
        upserting: false,
        createExchangeModalOpen: false
      };
      return newState;
    }
    case fromExchangeListActions.UPSERT_EXCHANGE_ERROR: {
      const payload: any = action.payload;
      return {
        ...state,
        upserting: false,
        upsertingError: true,
        upsertingErrorMessage: payload.error
      };
    }
    case fromExchangeListActions.OPEN_DELETE_EXCHANGE_MODAL: {
      return {
        ...state,
        deleteExchangeModalOpen: true
      };
    }
    case fromExchangeListActions.CLOSE_DELETE_EXCHANGE_MODAL: {
      return {
        ...state,
        deleteExchangeModalOpen: false
      };
    }
    case fromExchangeListActions.DELETE_EXCHANGE: {
      return {
        ...state,
        deleting: true
      };
    }
    case fromExchangeListActions.DELETE_EXCHANGE_SUCCESS: {
      return {
        ...state,
        deleting: false,
        deletingError: false,
        deleteExchangeModalOpen: false
      };
    }
    case fromExchangeListActions.DELETE_EXCHANGE_ERROR: {
      return {
        ...state,
        deleting: false,
        deletingError: true,
        deleteExchangeModalOpen: false
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getSearchQuery = (state: State) => state.searchQuery;
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getUpserting = (state: State) => state.upserting;
export const getUpsertingError = (state: State) => state.upsertingError;
export const getUpsertingErrorMessage = (state: State) => state.upsertingErrorMessage;
export const getCreateExchangeModalOpen = (state: State) => state.createExchangeModalOpen;
export const getDeleting = (state: State) => state.deleting;
export const getDeletingError = (state: State) => state.deletingError;
export const getDeleteExchangeModalOpen = (state: State) => state.deleteExchangeModalOpen;
