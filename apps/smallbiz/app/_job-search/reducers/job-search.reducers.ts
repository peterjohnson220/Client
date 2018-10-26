import * as fromJobSearchActions from '../actions/job-search.actions';
import { JobSearchResult } from '../models/job-search-result';

export interface State {
  searchTerm: string;
  isSearching: boolean;
  searchSuccess: boolean;
  searchFailure: boolean;
  searchResult: JobSearchResult;
}

const initialState: State = {
  searchTerm: '',
  isSearching: false,
  searchSuccess: false,
  searchFailure: false,
  searchResult: null
};

export function reducer(state: State = initialState, action: fromJobSearchActions.JobSearchAction): State {
  switch (action.type) {
    case fromJobSearchActions.JOB_SEARCH: {
      return {
        ...state,
        searchTerm: action.payload.searchTerm,
        isSearching: true,
      };
    }
    case fromJobSearchActions.JOB_SEARCH_SUCCESS: {
      return {
        ...state,
        isSearching: false,
        searchSuccess: true,
        searchResult: action.payload.searchResult
      };
    }
    case fromJobSearchActions.JOB_SEARCH_FAILURE: {
      return {
        ...state,
        isSearching: false,
        searchFailure: true,
      };
    }
    default: {
      return state;
    }
  }
}

export const getSearchTerm = (state: State) => state.searchTerm;
export const getIsSearching = (state: State) => state.isSearching;
export const getSearchSuccess = (state: State) => state.searchSuccess;
export const getSearchFailure = (state: State) => state.searchFailure;
export const getSearchResult = (state: State) => state.searchResult;
