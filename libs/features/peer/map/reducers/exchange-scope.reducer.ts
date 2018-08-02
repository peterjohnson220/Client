import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeScopeItem } from 'libs/models/peer/exchange-scope';

import * as fromExchangeScopeActions from '../actions/exchange-scope.actions';

// Extended entity state
export interface State extends EntityState<ExchangeScopeItem> {
  loading: boolean;
  loadingError: boolean;
  loadingDetails: boolean;
  loadingDetailsError: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<ExchangeScopeItem> = createEntityAdapter<ExchangeScopeItem>({
  selectId: (exchangeScopeItem: ExchangeScopeItem) => exchangeScopeItem.Id
});

// Initial State
export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  loadingDetails: false,
  loadingDetailsError: false
});

// Reducer
export function reducer(state = initialState, action: fromExchangeScopeActions.Actions): State {
  switch (action.type) {
    case fromExchangeScopeActions.LOAD_EXCHANGE_SCOPES: {
      return {
        ...adapter.removeAll(state),
        loading: true
      };
    }
    case fromExchangeScopeActions.LOAD_EXCHANGE_SCOPES_SUCCESS: {
      const scopes: ExchangeScopeItem[] = action.payload;
      return {
        ...adapter.addAll(scopes, state),
        loading: false
      };
    }
    case fromExchangeScopeActions.LOAD_EXCHANGE_SCOPES_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromExchangeScopeActions.LOAD_EXCHANGE_SCOPE_DETAILS: {
      return {
        ...state,
        loadingDetails: true
      };
    }
    case fromExchangeScopeActions.LOAD_EXCHANGE_SCOPE_DETAILS_SUCCESS: {
      return {
        ...state,
        loadingDetails: false
      };
    }
    case fromExchangeScopeActions.LOAD_EXCHANGE_SCOPE_DETAILS_ERROR: {
      return {
        ...state,
        loadingDetails: false,
        loadingDetailsError: true
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
export const getLoadingDetails = (state: State) => state.loadingDetails;
export const getLoadingDetailsError = (state: State) => state.loadingDetailsError;
