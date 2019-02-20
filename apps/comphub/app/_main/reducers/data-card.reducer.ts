import * as fromDataCardActions from '../actions/data-card.actions';
import { JobData, JobGridData } from '../models';
import { RateType } from '../data';
import { JobPricingLimitInfo } from '../models';

export interface State {
  loading: boolean;
  loadingError: boolean;
  jobResults: JobGridData;
  selectedJobData: JobData;
  selectedRate: RateType;
  marketDataChange: boolean;
  peerBannerOpen: boolean;
  pricedJobTitleHistory: string[];
  jobPricingLimitInfo: JobPricingLimitInfo;
  shouldIncrementPricedJobCount: boolean;
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
  pricedJobTitleHistory: [],
  jobPricingLimitInfo: null,
  shouldIncrementPricedJobCount: false
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
    case fromDataCardActions.SET_JOB_PRICING_LIMIT_INFO: {
      return {
        ...state,
        jobPricingLimitInfo: action.payload
      };
    }
    case fromDataCardActions.ADD_TO_PRICED_JOB_TITLE_HISTORY: {
      return {
        ...state,
        pricedJobTitleHistory: [...state.pricedJobTitleHistory, action.payload]
      };
    }
    case fromDataCardActions.SHOULD_INCREMENT_PRICED_JOB_COUNT: {
      return {
        ...state,
        shouldIncrementPricedJobCount: action.payload
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
export const getJobPricingLimitInfo = (state: State) => state.jobPricingLimitInfo;
export const getShouldIncrementPricedJobCount = (state: State) => state.shouldIncrementPricedJobCount;
export const getPricedJobTitleHistory = (state: State) => state.pricedJobTitleHistory;
