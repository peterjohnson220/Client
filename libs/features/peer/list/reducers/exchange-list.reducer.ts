import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeListItem } from 'libs/models';

import * as fromExchangeListActions from '../actions/exchange-list.actions';

// Extended entity state
export interface State extends EntityState<ExchangeListItem> {
  loading: boolean;
  loadingError: boolean;
  upserting: boolean;
  upsertingError: boolean;
  upsertingErrorMessage: string;
  createExchangeModalOpen: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<ExchangeListItem> = createEntityAdapter<ExchangeListItem>({
  selectId: (exchangeListItem: ExchangeListItem) => exchangeListItem.ExchangeId
});


// Initial State
export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  upserting: false,
  upsertingError: false,
  upsertingErrorMessage: '',
  createExchangeModalOpen: false
});


// Reducer
export function reducer(
  state = initialState,
  action: fromExchangeListActions.Actions
): State {
  switch (action.type) {
    case fromExchangeListActions.LOADING_EXCHANGES: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromExchangeListActions.LOADING_EXCHANGES_SUCCESS: {
      return {
        ...adapter.addAll(action.payload, state),
        loading: false
      };
    }
    case fromExchangeListActions.LOADING_EXCHANGES_ERROR: {
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
    case fromExchangeListActions.UPSERTING_EXCHANGE: {
      return {
        ...state,
        upserting: true,
        upsertingError: false
      };
    }
    case fromExchangeListActions.UPSERTING_EXCHANGE_SUCCESS: {
      const newState = {
        ...state,
        upserting: false,
        createExchangeModalOpen: false
      };
      return newState;
    }
    case fromExchangeListActions.UPSERTING_EXCHANGE_ERROR: {
      const payload: any = action.payload;
      return {
        ...state,
        upserting: false,
        upsertingError: true,
        upsertingErrorMessage: payload.error
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
export const getUpserting = (state: State) => state.upserting;
export const getUpsertingError = (state: State) => state.upsertingError;
export const getUpsertingErrorMessage = (state: State) => state.upsertingErrorMessage;
export const getCreateExchangeModalOpen = (state: State) => state.createExchangeModalOpen;
