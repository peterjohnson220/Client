import * as fromSummaryCardActions from '../actions/summary-card.actions';
import { JobSalaryTrend } from '../models';

export interface State {
  salaryTrendData: JobSalaryTrend;
  loadingSalaryTrend: boolean;
  loadingSalaryTrendError: boolean;
}

const initialState: State = {
  salaryTrendData: null,
  loadingSalaryTrend: false,
  loadingSalaryTrendError: false
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

    default: {
      return state;
    }
  }
}

// Selector functions
export const getSalaryTrendData = (state: State) => state.salaryTrendData;
export const getLoadingSalaryTrendData = (state: State) => state.loadingSalaryTrend;
export const getLoadingSalaryTrendError = (state: State) => state.loadingSalaryTrendError;
