import * as fromJobsPageActions from '../actions/jobs-page.actions';
import { TrendingJob } from '../models/trending-job.model';

export interface State {
  trendingJobs: TrendingJob[];
  loadingTrendingJobs: boolean;
  loadingTrendingJobsError: boolean;
}

const initialState: State = {
  trendingJobs: [],
  loadingTrendingJobs: false,
  loadingTrendingJobsError: false
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
        trendingJobs: action.payload
      };
    }
    case fromJobsPageActions.GET_TRENDING_JOBS_ERROR: {
      return {
        ...state,
        loadingTrendingJobs: false,
        loadingTrendingJobsError: false
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getTrendingJobs = (state: State) => state.trendingJobs;
export const getLoadingTrendingJobs = (state: State) => state.loadingTrendingJobs;
export const getLoadingTrendingJobsError = (state: State) => state.loadingTrendingJobsError;
