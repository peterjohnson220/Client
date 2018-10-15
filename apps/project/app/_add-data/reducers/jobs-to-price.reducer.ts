import * as fromJobsToPriceActions from '../actions/jobs-to-price.actions';
import { JobToPrice } from '../models';

export interface State {
  loadingJobs: boolean;
  loadingJobsError: boolean;
  jobsToPrice: JobToPrice[];
}

const initialState: State = {
  loadingJobs: false,
  jobsToPrice: [],
  loadingJobsError: false
};

// Reducer function
export function reducer(state = initialState, action: fromJobsToPriceActions.Actions): State {
  switch (action.type) {

    case fromJobsToPriceActions.GET_JOBS_TO_PRICE: {
      return {
        ...state,
        loadingJobs: true
      };
    }
    case fromJobsToPriceActions.GET_JOBS_TO_PRICE_SUCCESS: {
      return {
        ...state,
        loadingJobs: false,
        jobsToPrice: action.payload
      };
    }
    case fromJobsToPriceActions.GET_JOBS_TO_PRICE_ERROR: {
      return {
        ...state,
        loadingJobs: false,
        loadingJobsError: true
      };
    }

    default: {
      return state;
    }
  }
}

// Selector functions
export const getLoadingJobs = (state: State) => state.loadingJobs;
export const getLoadingJobsError = (state: State) => state.loadingJobsError;
export const getJobsToPrice = (state: State) => state.jobsToPrice;
