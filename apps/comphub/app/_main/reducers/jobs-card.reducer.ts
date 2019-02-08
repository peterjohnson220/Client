import * as cloneDeep from 'lodash.clonedeep';

import * as fromJobsCardActions from '../actions/jobs-card.actions';
import { TrendingJobGroup } from '../models';

export interface State {
  trendingJobGroups: TrendingJobGroup[];
  loadingTrendingJobs: boolean;
  loadingTrendingJobsError: boolean;
  loadingJobSearchOptions: boolean;
  jobSearchOptions: string[];
  loadingJobSearchOptionsError: boolean;
  selectedJob: string;
}

const initialState: State = {
  trendingJobGroups: [],
  loadingTrendingJobs: false,
  loadingTrendingJobsError: false,
  jobSearchOptions: [],
  loadingJobSearchOptions: false,
  loadingJobSearchOptionsError: false,
  selectedJob: null
};

// Reducer function
export function reducer(state = initialState, action: fromJobsCardActions.Actions): State {
  switch (action.type) {

    case fromJobsCardActions.GET_TRENDING_JOBS: {
      return {
        ...state,
        loadingTrendingJobs: true
      };
    }
    case fromJobsCardActions.GET_TRENDING_JOBS_SUCCESS: {
      return {
        ...state,
        loadingTrendingJobs: false,
        trendingJobGroups: cloneDeep(action.payload).sort((a, b) => a.Order - b.Order)
      };
    }
    case fromJobsCardActions.GET_TRENDING_JOBS_ERROR: {
      return {
        ...state,
        loadingTrendingJobs: false,
        loadingTrendingJobsError: false
      };
    }
    case fromJobsCardActions.GET_JOB_SEARCH_OPTIONS: {
      return {
        ...state,
        loadingJobSearchOptions: true,
        loadingJobSearchOptionsError: false
      };
    }
    case fromJobsCardActions.GET_JOB_SEARCH_OPTIONS_SUCCESS: {
      return {
        ...state,
        loadingJobSearchOptions: false,
        loadingJobSearchOptionsError: false,
        jobSearchOptions: action.payload
      };
    }
    case fromJobsCardActions.GET_JOB_SEARCH_OPTIONS_ERROR: {
      return {
        ...state,
        loadingJobSearchOptions: false,
        loadingJobSearchOptionsError: true
      };
    }
    case fromJobsCardActions.SET_SELECTED_JOB: {
      return {
        ...state,
        selectedJob: action.payload
      };
    }
    case fromJobsCardActions.CLEAR_SELECTED_JOB: {
      return {
        ...state,
        selectedJob: null
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
export const getSelectedJob = (state: State) => state.selectedJob;
