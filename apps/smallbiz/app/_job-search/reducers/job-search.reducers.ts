import * as fromJobSearchActions from '../actions/job-search.actions';
import { JobTitle } from '../../shared/models/jobTitle';

export interface State {
    isSearching: boolean;
    searchSuccess: boolean;
    searchFailure: boolean;
    searchResults: JobTitle[];
}

const initialState: State = {
    isSearching: false,
    searchSuccess: false,
    searchFailure: false,
    searchResults: []
};

export function reducer(state: State = initialState, action: fromJobSearchActions.JobSearchAction): State {
    switch (action.type) {
        case fromJobSearchActions.JOB_SEARCH: {
            return {
                ...state,
                isSearching: true,
            };
        }
        case fromJobSearchActions.JOB_SEARCH_SUCCESS: {
            return {
                ...state,
                isSearching: false,
                searchSuccess: true,
                searchResults: action.payload.searchResults
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

export const getIsSearching = (state: State) => state.isSearching;
export const getSearchSuccess = (state: State) => state.searchSuccess;
export const getSearchFailure = (state: State) => state.searchFailure;
export const getSearchResults = (state: State) => state.searchResults;
