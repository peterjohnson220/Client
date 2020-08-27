import cloneDeep from 'lodash/cloneDeep';

import { RateType } from 'libs/data/data-sets';

import * as fromDataCardActions from '../actions/data-card.actions';
import { JobData, JobGridData } from '../models';

export interface State {
  loading: boolean;
  loadingError: boolean;
  jobResults: JobGridData;
  selectedJobData: JobData;
  selectedRate: RateType;
  marketDataChange: boolean;
  peerBannerOpen: boolean;
  loadingPeerJobData: boolean;
  loadingPeerJobDataError: boolean;
  forceRefreshPeerMap: boolean;
}

const initialState: State = {
  loading: false,
  loadingError: false,
  jobResults: {
    Data: [],
    Total: 0
  },
  selectedJobData: null,
  selectedRate: RateType.Annual,
  marketDataChange: false,
  peerBannerOpen: false,
  loadingPeerJobData: false,
  loadingPeerJobDataError: false,
  forceRefreshPeerMap: false
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
        loadingError: false,
        marketDataChange: false
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
    case fromDataCardActions.SET_MARKET_DATA_CHANGE: {
      return {
        ...state,
        marketDataChange: action.payload
      };
    }
    case fromDataCardActions.SHOW_PEER_BANNER: {
      return {
        ...state,
        peerBannerOpen: true
      };
    }
    case fromDataCardActions.TOGGLE_JOB_DESCRIPTION: {
      const newJobResults = cloneDeep(state.jobResults);
      const jobToShowJd = newJobResults.Data.find(jr => jr.JobId === action.payload.jobId);
      jobToShowJd.ShowJd = !jobToShowJd.ShowJd;

      return {
        ...state,
        jobResults: newJobResults
      };
    }
    case fromDataCardActions.GET_PEER_QUICK_PRICE_DATA: {
      return {
        ...state,
        loadingPeerJobData: true,
        loadingPeerJobDataError: false
      };
    }
    case fromDataCardActions.GET_PEER_QUICK_PRICE_DATA_SUCCESS: {
      return {
        ...state,
        loadingPeerJobData: false,
        loadingPeerJobDataError: false,
        selectedJobData: action.payload.jobData
      };
    }
    case fromDataCardActions.GET_PEER_QUICK_PRICE_DATA_ERROR: {
      return {
        ...state,
        loadingPeerJobData: false,
        loadingPeerJobDataError: true
      };
    }
    case fromDataCardActions.SET_FORCE_REFRESH_PEER_MAP: {
      return{
        ...state,
        forceRefreshPeerMap: action.payload
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
export const getMarketDataChange = (state: State) => state.marketDataChange;
export const getPeerBannerOpen = (state: State) => state.peerBannerOpen;
export const getForcePeerMapRefresh = (state: State) => state.forceRefreshPeerMap;
