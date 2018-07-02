import * as fromSearchResultsActions from '../actions/search-results.actions';

import { JobResult } from '../models';

export interface State {
  results: JobResult[];
  loadingMoreResults: boolean;
  loadingResults: boolean;
}

const initialState: State = {
  results: [],
  loadingMoreResults: false,
  loadingResults: false
};

// Reducer function
export function reducer(state = initialState, action: fromSearchResultsActions.Actions): State {
  switch (action.type) {
    case fromSearchResultsActions.GET_RESULTS: {
      return {
        ...state,
        loadingResults: true
      };
    }
    case fromSearchResultsActions.GET_RESULTS_SUCCESS: {
      return {
        ...state,
        results: action.payload,
        loadingResults: false
      };
    }
    case fromSearchResultsActions.GET_MORE_RESULTS: {
      return {
        ...state,
        loadingMoreResults: true
      };
    }
    case fromSearchResultsActions.GET_MORE_RESULTS_SUCCESS: {
      return {
        ...state,
        results: [...state.results, ...action.payload],
        loadingMoreResults: false
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getResults = (state: State) => state.results;
export const getLoadingResults = (state: State) => state.loadingResults;
export const getLoadingMoreResults = (state: State) => state.loadingMoreResults;
