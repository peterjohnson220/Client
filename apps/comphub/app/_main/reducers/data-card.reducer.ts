import * as fromDataCardActions from '../actions/data-card.actions';
import { JobData, JobGridData } from '../models';
import { RateType } from '../data';

export interface State {
  loading: boolean;
  loadingError: boolean;
  jobResults: JobGridData;
  selectedJobData: JobData;
  selectedRate: RateType;
}

const initialState: State = {
  loading: false,
  loadingError: false,
  jobResults: {
    Data: [],
    Total: 0
  },
  selectedJobData: null,
  selectedRate: RateType.Annual
};

// Reducer
export function reducer(state: State = initialState, action: fromDataCardActions.Actions) {
  switch (action.type) {
    case fromDataCardActions.GET_QUICK_PRICE_MARKET_DATA: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromDataCardActions.GET_QUICK_PRICE_MARKET_DATA_SUCCESS: {
      return {
        ...state,
        jobResults: action.payload,
        loading: false,
        loadingError: false
      };
    }
    case fromDataCardActions.GET_QUICK_PRICE_MARKET_DATA_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromDataCardActions.SET_SELECTED_JOB_DATA: {
      return {
        ...state,
        selectedJobData: action.payload
      };
    }
    case fromDataCardActions.SET_SELECTED_RATE: {
      return {
        ...state,
        selectedRate: action.payload
      };
    }
    case fromDataCardActions.CLEAR_SELECTED_JOB_DATA: {
      return {
        ...state,
        selectedJobData: null
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
export const getSelectedJobData = (state: State) => state.selectedJobData;
export const getSelectedRate = (state: State) => state.selectedRate;
