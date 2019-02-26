import * as fromSummaryCardActions from '../actions/summary-card.actions';
import { JobSalaryTrend } from '../models';

export interface State {
  salaryTrendData: JobSalaryTrend;
  loadingSalaryTrend: boolean;
  loadingSalaryTrendError: boolean;
  sharePricingSummaryModalOpen: boolean;
  sharePricingSummaryError: boolean;
  sharePricingSummaryConflict: boolean;
}

const initialState: State = {
  salaryTrendData: null,
  loadingSalaryTrend: false,
  loadingSalaryTrendError: false,
  sharePricingSummaryModalOpen: false,
  sharePricingSummaryError: false,
  sharePricingSummaryConflict: false
};

// Reducer function
export function reducer(state = initialState, action: fromSummaryCardActions.Actions): State {
  switch (action.type) {

    case fromSummaryCardActions.GET_JOB_NATIONAL_TREND: {
      return {
        ...state,
        loadingSalaryTrend: true
      };
    }
    case fromSummaryCardActions.GET_JOB_NATIONAL_TREND_SUCCESS: {
      return {
        ...state,
        loadingSalaryTrend: false,
        loadingSalaryTrendError: false,
        salaryTrendData: action.payload
      };
    }
    case fromSummaryCardActions.GET_JOB_NATIONAL_TREND_ERROR: {
      return {
        ...state,
        loadingSalaryTrend: false,
        loadingSalaryTrendError: true
      };
    }
    case fromSummaryCardActions.OPEN_SHARE_MODAL: {
      return {
        ...state,
        sharePricingSummaryModalOpen: true
      };
    }
    case fromSummaryCardActions.CLOSE_SHARE_MODAL: {
      return {
        ...state,
        sharePricingSummaryModalOpen: false
      };
    }
    case fromSummaryCardActions.SHARE_PRICING_SUMMARY: {
      return {
        ...state,
        sharePricingSummaryError: false,
        sharePricingSummaryConflict: false
      };
    }
    case fromSummaryCardActions.SHARE_PRICING_SUMMARY_ERROR: {
      return {
        ...state,
        sharePricingSummaryError: true
      };
    }
    case fromSummaryCardActions.SHARE_PRICING_SUMMARY_CONFLICT: {
      return {
        ...state,
        sharePricingSummaryConflict: true
      };
    }

    default: {
      return state;
    }
  }
}

// Selector functions
export const getSalaryTrendData = (state: State) => state.salaryTrendData;
export const getLoadingSalaryTrendData = (state: State) => state.loadingSalaryTrend;
export const getLoadingSalaryTrendError = (state: State) => state.loadingSalaryTrendError;
export const getSharePricingSummaryModalOpen = (state: State) => state.sharePricingSummaryModalOpen;
export const getSharePricingSummaryError = (state: State) => state.sharePricingSummaryError;
export const getSharePricingSummaryConflict = (state: State) => state.sharePricingSummaryConflict;
