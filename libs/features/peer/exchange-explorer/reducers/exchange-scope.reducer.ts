import { ExchangeScopeItem } from 'libs/models/peer/exchange-scope';

import * as fromExchangeScopeActions from '../actions/exchange-scope.actions';

// Extended entity state
export interface State {
  loadingByJobs: boolean;
  loadingByJobsError: boolean;
  loadingByExchange: boolean;
  loadingByExchangeError: boolean;
  loadingDetails: boolean;
  loadingDetailsError: boolean;
  upserting: boolean;
  upsertingError: boolean;
  deletingScope: boolean;
  deletingScopeError: boolean;
  inDeleteScopeMode: boolean;
  exchangeScopeToDelete: ExchangeScopeItem;
  includeCompanyScopes: boolean;
  includeStandardScopes: boolean;
  exchangeScopeNameFilter: string;
  exchangeScopes: ExchangeScopeItem[];
}

// Initial State
export const initialState: State = {
  loadingByJobs: false,
  loadingByJobsError: false,
  loadingByExchange: false,
  loadingByExchangeError: false,
  loadingDetails: false,
  loadingDetailsError: false,
  upserting: false,
  upsertingError: false,
  deletingScope: false,
  deletingScopeError: false,
  inDeleteScopeMode: false,
  exchangeScopeToDelete: null,
  includeCompanyScopes: true,
  includeStandardScopes: false,
  exchangeScopeNameFilter: '',
  exchangeScopes: []

};

export let initialLoadCompleteState: State = null;

// Reducer
export function reducer(state = initialState, action: fromExchangeScopeActions.Actions): State {
  switch (action.type) {
    case fromExchangeScopeActions.LOAD_EXCHANGE_SCOPES_BY_JOBS: {
    return {
      ...state,
      loadingByJobs: true
    };
  }
    case fromExchangeScopeActions.LOAD_EXCHANGE_SCOPES_BY_JOBS_SUCCESS: {
      return {
        ...state,
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
        ...state,
        loadingByExchange: true
      };
    }
    case fromExchangeScopeActions.LOAD_EXCHANGE_SCOPES_BY_EXCHANGE_SUCCESS: {
      return {
        ...state,
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
    case fromExchangeScopeActions.UPSERT_EXCHANGE_SCOPE: {
      return {
        ...state,
        upserting: true,
        upsertingError: false
      };
    }
    case fromExchangeScopeActions.UPSERT_EXCHANGE_SCOPE_SUCCESS: {
      return {
        ...state,
        upserting: false,
        upsertingError: false
      };
    }
    case fromExchangeScopeActions.UPSERT_EXCHANGE_SCOPE_ERROR: {
      return {
        ...state,
        upserting: false,
        upsertingError: true
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
        ...state,
        exchangeScopes: state.exchangeScopes.filter(x => x.ExchangeScopeId !== action.payload),
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
    case fromExchangeScopeActions.RESET_INITIALLY_LOADED_STATE: {
      return !!initialLoadCompleteState ? {...initialLoadCompleteState} : {...state};
    }
    case fromExchangeScopeActions.SET_INCLUDE_COMPANY_SCOPES: {
      return {
        ...state,
        includeCompanyScopes: action.payload
      };
    }
    case fromExchangeScopeActions.SET_INCLUDE_STANDARD_SCOPES: {
      return {
        ...state,
        includeStandardScopes: action.payload
      };
    }
    case fromExchangeScopeActions.SET_EXCHANGE_SCOPES: {
        return{
          ...state,
          exchangeScopes: action.payload
        };
    }
    case fromExchangeScopeActions.SET_EXCHANGE_SCOPE_NAME_FILTER: {
      return {
        ...state,
        exchangeScopeNameFilter: action.payload
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
export const getUpserting = (state: State) => state.upserting;
export const getUpsertingError = (state: State) => state.upsertingError;
export const getDeletingScope = (state: State) => state.deletingScope;
export const getDeletingScopeError = (state: State) => state.deletingScopeError;
export const getInDeleteScopeMode = (state: State) => state.inDeleteScopeMode;
export const getExchangeScopeToDelete = (state: State) => state.exchangeScopeToDelete;
export const getIncludeCompanyScopes = (state: State) => state.includeCompanyScopes;
export const getIncludeStandardScopes = (state: State) => state.includeStandardScopes;
export const getExchangeScopes = (state: State) => state.exchangeScopes;
export const getExchangeScopeNameFilter = (state: State) => state.exchangeScopeNameFilter;
