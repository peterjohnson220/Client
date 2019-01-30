import { GridDataResult } from '@progress/kendo-angular-grid';

import * as fromDataPageActions from '../actions/data-page.actions';

export interface State {
  loading: boolean;
  loadingError: boolean;
  jobResults: GridDataResult;
}

const initialState: State = {
  loading: false,
  loadingError: false,
  jobResults: null
};

// Reducer
export function reducer(state: State = initialState, action: fromDataPageActions.Actions) {
  switch (action.type) {
    case fromDataPageActions.GET_QUICK_PRICE_MARKET_DATA: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromDataPageActions.GET_QUICK_PRICE_MARKET_DATA_SUCCESS: {
      return {
        ...state,
        jobResults: action.payload,
        loading: false,
        loadingError: false
      };
    }
    case fromDataPageActions.GET_QUICK_PRICE_MARKET_DATA_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
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
