import * as cloneDeep from 'lodash.clonedeep';
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
    case fromJobsToPriceActions.GET_MATCH_JOB_CUTS: {
      const jobToPriceId = action.payload.Id;
      const jobsToPriceCopy = cloneDeep(state.jobsToPrice);
      const jobToPrice = jobsToPriceCopy.find(x => x.Id === jobToPriceId);
      jobToPrice.LoadingDataCuts = true;
      return {
        ...state,
        jobsToPrice: jobsToPriceCopy
      };
    }
    case fromJobsToPriceActions.GET_MATCH_JOB_CUTS_SUCCESS: {
      const jobToPriceId = action.payload.JobId;
      const jobsToPriceCopy = cloneDeep(state.jobsToPrice);
      const jobToPrice = jobsToPriceCopy.find(x => x.Id === jobToPriceId);
      jobToPrice.LoadingDataCuts = false;
      jobToPrice.DataCuts = action.payload.JobMatchCuts;
      return {
        ...state,
        jobsToPrice: jobsToPriceCopy
      };
    }
    case fromJobsToPriceActions.CLEAR_ALL_JOBS: {
      return {
        ...state,
        jobsToPrice: []
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
