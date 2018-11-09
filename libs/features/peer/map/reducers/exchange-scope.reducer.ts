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
  loadingDetailsError: false
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
        ...adapter.addAll(scopes, state),
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
        ...adapter.addAll(scopes, state),
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
