import * as fromJobsPageActions from '../actions/jobs-page.actions';
import { TrendingJobGroup } from '../models';

export interface State {
  trendingJobGroups: TrendingJobGroup[];
  loadingTrendingJobs: boolean;
  loadingTrendingJobsError: boolean;
  loadingJobSearchOptions: boolean;
  jobSearchOptions: string[];
  loadingJobSearchOptionsError: boolean;
}

const initialState: State = {
  trendingJobGroups: [],
  loadingTrendingJobs: false,
  loadingTrendingJobsError: false,
  jobSearchOptions: [],
  loadingJobSearchOptions: false,
  loadingJobSearchOptionsError: false
};

// Reducer function
export function reducer(state = initialState, action: fromJobsPageActions.Actions): State {
  switch (action.type) {

    case fromJobsPageActions.GET_TRENDING_JOBS: {
      return {
        ...state,
        loadingTrendingJobs: true
      };
    }
    case fromJobsPageActions.GET_TRENDING_JOBS_SUCCESS: {
      return {
        ...state,
        loadingTrendingJobs: false,
        trendingJobGroups: action.payload
      };
    }
    case fromJobsPageActions.GET_TRENDING_JOBS_ERROR: {
      return {
        ...state,
        loadingTrendingJobs: false,
        loadingTrendingJobsError: false
      };
    }
    case fromJobsPageActions.GET_JOB_SEARCH_OPTIONS: {
      return {
        ...state,
        loadingJobSearchOptions: true,
        loadingJobSearchOptionsError: false
      };
    }
    case fromJobsPageActions.GET_JOB_SEARCH_OPTIONS_SUCCESS: {
      return {
        ...state,
        loadingJobSearchOptions: false,
        loadingJobSearchOptionsError: false,
        jobSearchOptions: action.payload
      };
    }
    case fromJobsPageActions.GET_JOB_SEARCH_OPTIONS_ERROR: {
      return {
        ...state,
        loadingJobSearchOptions: false,
        loadingJobSearchOptionsError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getTrendingJobGroups = (state: State) => state.trendingJobGroups;
export const getLoadingTrendingJobs = (state: State) => state.loadingTrendingJobs;
export const getLoadingTrendingJobsError = (state: State) => state.loadingTrendingJobsError;
export const getJobSearchOptions = (state: State) => state.jobSearchOptions;
export const getLoadingJobSearchOptions = (state: State) => state.loadingJobSearchOptions;
export const getLoadingJobSearchOptionsError = (state: State) => state.loadingJobSearchOptionsError;
