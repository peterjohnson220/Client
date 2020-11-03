import * as fromSearchResultsActions from '../actions/search-results.actions';

import { ResultsPagingOptions } from '../models';
import * as fromSearchPageActions from '../actions/search-page.actions';

export interface State {
  loadingMoreResults: boolean;
  loadingResults: boolean;
  pagingOptions: ResultsPagingOptions;
  totalResultsOnServer: number;
  error: boolean;
}

const initialState: State = {
  loadingMoreResults: false,
  loadingResults: false,
  pagingOptions: {
    page: 1,
    pageSize: 25
  },
  totalResultsOnServer: 0,
  error: false
};

// Reducer function
export function reducer(state = initialState, action: fromSearchResultsActions.Actions): State {
  switch (action.type) {
    case fromSearchResultsActions.GET_RESULTS: {
      return {
        ...state,
        error: false,
        loadingResults: true,
        pagingOptions: initialState.pagingOptions
      };
    }
    case fromSearchResultsActions.GET_RESULTS_SUCCESS: {
      return {
        ...state,
        loadingResults: false,
        totalResultsOnServer: action.payload.totalRecordCount
      };
    }
    case fromSearchResultsActions.GET_MORE_RESULTS: {
      return {
        ...state,
        error: false,
        loadingMoreResults: true,
        pagingOptions: {...state.pagingOptions, page: state.pagingOptions.page + 1}
      };
    }
    case fromSearchResultsActions.GET_MORE_RESULTS_SUCCESS: {
      return {
        ...state,
        loadingMoreResults: false
      };
    }
    case fromSearchResultsActions.GET_RESULTS_ERROR: {
      return {
        ...state,
        error: true
      };
    }
    case fromSearchResultsActions.CLEAR_RESULTS: {
      return {
        ...state,
        totalResultsOnServer: 0
      };
    }
    case fromSearchResultsActions.RESET: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getLoadingResults = (state: State) => state.loadingResults;
export const getLoadingMoreResults = (state: State) => state.loadingMoreResults;
export const getPagingOptions = (state: State) => state.pagingOptions;
export const getNumberOfResultsOnServer = (state: State) => state.totalResultsOnServer;
export const getError = (state: State) => state.error;
