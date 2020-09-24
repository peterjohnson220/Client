import cloneDeep from 'lodash/cloneDeep';

import * as fromJobGridActions from '../actions/job-grid.actions';
import { JobGridData } from '../models';

export interface State {
  loading: boolean;
  loadingError: boolean;
  jobResults: JobGridData;
}

const initialState: State = {
  loading: false,
  loadingError: false,
  jobResults: {
    Data: [],
    Total: 0
  }
};

export function reducer(state: State = initialState, action: fromJobGridActions.Actions) {
  switch (action.type) {
    case fromJobGridActions.GET_QUICK_PRICE_MARKET_DATA: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromJobGridActions.GET_QUICK_PRICE_MARKET_DATA_SUCCESS: {
      return {
        ...state,
        jobResults: action.payload,
        loading: false,
        loadingError: false,
        marketDataChange: false
      };
    }
    case fromJobGridActions.GET_QUICK_PRICE_MARKET_DATA_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromJobGridActions.LOAD_MORE_DATA_SUCCESS: {
      const dataClone: JobGridData = cloneDeep(state.jobResults);
      dataClone.Data = dataClone.Data.concat(action.payload);
      return {
        ...state,
        loading: false,
        jobResults: dataClone
      };
    }
    case fromJobGridActions.TOGGLE_JOB_DESCRIPTION: {
      const newJobResults = cloneDeep(state.jobResults);
      const jobToShowJd = newJobResults.Data.find(jr => jr.JobId === action.payload.jobId);
      jobToShowJd.ShowJd = !jobToShowJd.ShowJd;

      return {
        ...state,
        jobResults: newJobResults
      };
    }
    default: {
      return state;
    }
  }
}

export const getLoadingJobGridResults = (state: State) => state.loading;
export const getLoadingJobGridResultsError = (state: State) => state.loadingError;
export const getJobGridResults = (state: State) => state.jobResults;
