import cloneDeep from 'lodash/cloneDeep';

import { JobGridData } from 'libs/models/comphub';

import * as fromJobGridActions from '../actions/job-grid.actions';

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
    case fromJobGridActions.GET_QUICK_PRICE_MARKET_DATA:
    case fromJobGridActions.GET_PEER_JOB_DATA:
    case fromJobGridActions.SEARCH_CROWD_SOURCED_JOBS_BY_TITLE: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromJobGridActions.GET_QUICK_PRICE_DATA_SUCCESS:
    case fromJobGridActions.SEARCH_CROWD_SOURCED_JOBS_BY_TITLE_SUCCESS: {
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
    case fromJobGridActions.GET_CROWD_SOURCED_JOB_PRICING: {
      const jobResults = cloneDeep(state.jobResults);
      const jobToUpdate = jobResults.Data.find(jr => jr.JobTitle === action.payload.JobTitle);
      jobToUpdate.Loading = true;

      return {
        ...state,
        jobResults: jobResults
      };
    }
    case fromJobGridActions.GET_CROWD_SOURCED_JOB_PRICING_SUCCESS: {
      const jobResults = cloneDeep(state.jobResults);
      const jobToUpdate = jobResults.Data.find(jr => jr.JobTitle === action.payload.JobTitle);
      jobToUpdate.Base10 = action.payload.Base10;
      jobToUpdate.Base25 = action.payload.Base25;
      jobToUpdate.Base50 = action.payload.Base50;
      jobToUpdate.Base75 = action.payload.Base75;
      jobToUpdate.Base90 = action.payload.Base90;
      jobToUpdate.BaseAvg = action.payload.BaseAvg;
      jobToUpdate.Tcc10 = action.payload.Tcc10;
      jobToUpdate.Tcc25 = action.payload.Tcc25;
      jobToUpdate.Tcc50 = action.payload.Tcc50;
      jobToUpdate.Tcc75 = action.payload.Tcc75;
      jobToUpdate.Tcc90 = action.payload.Tcc90;
      jobToUpdate.TccAvg = action.payload.TccAvg;
      jobToUpdate.Loading = false;

      return {
        ...state,
        jobResults: jobResults
      };
    }
    case fromJobGridActions.TOGGLE_CROWD_SOURCED_TASKS: {
      const newJobResults = cloneDeep(state.jobResults);
      const jobToShowJd = newJobResults.Data.find(jr => jr.JobTitle === action.payload.jobTitle);
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
