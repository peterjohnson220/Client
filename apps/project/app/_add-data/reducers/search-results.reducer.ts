import * as fromSearchResultsActions from '../actions/search-results.actions';

import { JobResult, ResultsPagingOptions } from '../models';
import { mapSurveyJobsToJobResults } from '../helpers';

export interface State {
  results: JobResult[];
  loadingMoreResults: boolean;
  loadingResults: boolean;
  pagingOptions: ResultsPagingOptions;
  totalResultsOnServer: number;
  tooltipOpen: boolean;
}

const initialState: State = {
  results: [],
  loadingMoreResults: false,
  loadingResults: false,
  pagingOptions: {
    page: 1,
    pageSize: 25
  },
  totalResultsOnServer: 0,
  tooltipOpen: false
};

// Reducer function
export function reducer(state = initialState, action: fromSearchResultsActions.Actions): State {
  switch (action.type) {
    case fromSearchResultsActions.GET_RESULTS: {
      return {
        ...state,
        loadingResults: true,
        pagingOptions: initialState.pagingOptions
      };
    }
    case fromSearchResultsActions.GET_RESULTS_SUCCESS: {
      return {
        ...state,
        results: mapSurveyJobsToJobResults(action.payload.SurveyJobs),
        loadingResults: false,
        totalResultsOnServer: action.payload.Paging.TotalRecordCount
      };
    }
    case fromSearchResultsActions.GET_MORE_RESULTS: {
      return {
        ...state,
        loadingMoreResults: true,
        pagingOptions: {...state.pagingOptions, page: state.pagingOptions.page + 1}
      };
    }
    case fromSearchResultsActions.GET_MORE_RESULTS_SUCCESS: {
      return {
        ...state,
        results: state.results.concat(mapSurveyJobsToJobResults(action.payload.SurveyJobs)),
        loadingMoreResults: false
      };
    }
    case fromSearchResultsActions.CLEAR_RESULTS: {
      return {
        ...state,
        results: [],
        totalResultsOnServer: 0,
        tooltipOpen: false
      };
    }
    case fromSearchResultsActions.OPEN_TOOLTIP: {
      return {
        ...state,
        tooltipOpen: true
      };
    }
    case fromSearchResultsActions.CLOSE_TOOLTIP: {
      return {
        ...state,
        tooltipOpen: false
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
export const getPagingOptions = (state: State) => state.pagingOptions;
export const getNumberOfResults = (state: State) => state.totalResultsOnServer;
export const hasMoreResultsOnServer = (state: State) => state.totalResultsOnServer > state.results.length;
export const getTooltipOpen = (state: State) => state.tooltipOpen;
