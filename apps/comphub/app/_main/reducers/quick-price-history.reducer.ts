import * as fromQuickPriceHistoryActions from '../actions/quick-price-history.actions';

export interface State {
  loadingJobData: boolean;
  loadingJobDataErrorMessage: string;
}

export const initialState: State = {
  loadingJobData: false,
  loadingJobDataErrorMessage: null
};

export function reducer(state = initialState, action: fromQuickPriceHistoryActions.Actions): State {
  switch (action.type) {
    case fromQuickPriceHistoryActions.GET_JOB_PRICED_HISTORY_SUMMARY: {
      return {
        ...state,
        loadingJobData: true,
        loadingJobDataErrorMessage: null
      };
    }
    case fromQuickPriceHistoryActions.GET_JOB_PRICED_HISTORY_SUMMARY_SUCCESS: {
      return {
        ...state,
        loadingJobData: false
      };
    }
    case fromQuickPriceHistoryActions.GET_JOB_PRICED_HISTORY_SUMMARY_ERROR: {
      return {
        ...state,
        loadingJobData: false,
        loadingJobDataErrorMessage: action.message
      };
    }
    default: {
      return state;
    }
  }
}

export const getLoadingJobDataHistory = (state: State) => state.loadingJobData;
export const getLoadingJobDataHistoryErrorMessage = (state: State) => state.loadingJobDataErrorMessage;
