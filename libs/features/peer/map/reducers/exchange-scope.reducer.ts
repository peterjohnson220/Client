import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ExchangeScopeItem } from 'libs/models/peer/exchange-scope';
import { arraySortByString, SortDirection } from 'libs/core/functions';

import * as fromExchangeScopeActions from '../actions/exchange-scope.actions';

// Extended entity state
export interface State extends EntityState<ExchangeScopeItem> {
  loadingByJobs: boolean;
  loadingByJobsError: boolean;
  loadingByExchange: boolean;
  loadingByExchangeError: boolean;
  loadingDetails: boolean;
  loadingDetailsError: boolean;
  deletingScope: boolean;
  deletingScopeError: boolean;
  inDeleteScopeMode: boolean;
  exchangeScopeToDelete: ExchangeScopeItem;
}

// Create entity adapter
export const adapter: EntityAdapter<ExchangeScopeItem> = createEntityAdapter<ExchangeScopeItem>({
  selectId: (exchangeScopeItem: ExchangeScopeItem) => exchangeScopeItem.Id,
  sortComparer: (a, b) => arraySortByString(a.Name, b.Name, SortDirection.Ascending)
});

// Initial State
export const initialState: State = adapter.getInitialState({
  loadingByJobs: false,
  loadingByJobsError: false,
  loadingByExchange: false,
  loadingByExchangeError: false,
  loadingDetails: false,
  loadingDetailsError: false,
  deletingScope: false,
  deletingScopeError: false,
  inDeleteScopeMode: false,
  exchangeScopeToDelete: null
});

// Reducer
export function reducer(state = initialState, action: fromExchangeScopeActions.Actions): State {
  switch (action.type) {
    case fromExchangeScopeActions.LOAD_EXCHANGE_SCOPES_BY_JOBS: {
    return {
      ...adapter.removeAll(state),
      loadingByJobs: true
    };
  }
    case fromExchangeScopeActions.LOAD_EXCHANGE_SCOPES_BY_JOBS_SUCCESS: {
      const scopes: ExchangeScopeItem[] = action.payload;
      return {
        ...adapter.setAll(scopes, state),
        loadingByJobs: false
      };
    }
    case fromExchangeScopeActions.LOAD_EXCHANGE_SCOPES_BY_JOBS_ERROR: {
      return {
        ...state,
        loadingByJobs: false,
        loadingByJobsError: true
      };
    }
    case fromExchangeScopeActions.LOAD_EXCHANGE_SCOPES_BY_EXCHANGE: {
      return {
        ...adapter.removeAll(state),
        loadingByExchange: true
      };
    }
    case fromExchangeScopeActions.LOAD_EXCHANGE_SCOPES_BY_EXCHANGE_SUCCESS: {
      const scopes: ExchangeScopeItem[] = action.payload;
      return {
        ...adapter.setAll(scopes, state),
        loadingByExchange: false
      };
    }
    case fromExchangeScopeActions.LOAD_EXCHANGE_SCOPES_BY_EXCHANGE_ERROR: {
      return {
        ...state,
        loadingByExchange: false,
        loadingByExchangeError: true
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
    case fromExchangeScopeActions.DELETE_EXCHANGE_SCOPE: {
      return {
        ...state,
        deletingScope: true,
        deletingScopeError: false
      };
    }
    case fromExchangeScopeActions.DELETE_EXCHANGE_SCOPE_SUCCESS: {
      return {
        ...adapter.removeOne(action.payload, state),
        deletingScope: false,
        deletingScopeError: false,
        inDeleteScopeMode: false,
        exchangeScopeToDelete: null
      };
    }
    case fromExchangeScopeActions.DELETE_EXCHANGE_SCOPE_ERROR: {
      return {
        ...state,
        deletingScope: false,
        deletingScopeError: true,
        inDeleteScopeMode: false,
        exchangeScopeToDelete: null
      };
    }
    case fromExchangeScopeActions.ENTER_DELETE_EXCHANGE_SCOPE_MODE: {
      return {
        ...state,
        inDeleteScopeMode: true
      };
    }
    case fromExchangeScopeActions.EXIT_DELETE_EXCHANGE_SCOPE_MODE: {
      return {
        ...state,
        inDeleteScopeMode: false
      };
    }
    case fromExchangeScopeActions.SET_EXCHANGE_SCOPE_TO_DELETE: {
      return {
        ...state,
        exchangeScopeToDelete: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getLoadingByJobs = (state: State) => state.loadingByJobs;
export const getLoadingByJobsError = (state: State) => state.loadingByJobsError;
export const getLoadingByExchange = (state: State) => state.loadingByExchange;
export const getLoadingByExchangeError = (state: State) => state.loadingByExchangeError;
export const getLoadingDetails = (state: State) => state.loadingDetails;
export const getLoadingDetailsError = (state: State) => state.loadingDetailsError;
export const getDeletingScope = (state: State) => state.deletingScope;
export const getDeletingScopeError = (state: State) => state.deletingScopeError;
export const getInDeleteScopeMode = (state: State) => state.inDeleteScopeMode;
export const getExchangeScopeToDelete = (state: State) => state.exchangeScopeToDelete;
