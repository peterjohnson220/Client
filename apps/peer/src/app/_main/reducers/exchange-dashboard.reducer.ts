import { Exchange, ChartItem } from 'libs/models';

import * as fromExchangeDashboardActions from '../actions/exchange-dashboard.actions';

export interface State {
  loading: boolean;
  loadingError: boolean;
  exchange: Exchange;
  industryChartItems: ChartItem[];
}

// Initial State
export const initialState: State = {
  loading: false,
  loadingError: false,
  exchange: null,
  industryChartItems: null
};

// Reducer
export function reducer(
  state = initialState,
  action: fromExchangeDashboardActions.Actions
): State {
  switch (action.type) {
    case fromExchangeDashboardActions.LOADING_EXCHANGE: {
      return {
        ...state,
        exchange: null,
        loading: true,
        loadingError: false
      };
    }
    case fromExchangeDashboardActions.LOADING_EXCHANGE_SUCCESS: {
      return {
        ...state,
        exchange: action.payload,
        loading: false
      };
    }
    case fromExchangeDashboardActions.LOADING_EXCHANGE_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromExchangeDashboardActions.LOADING_CHART: {
      return {
        ...state,
        industryChartItems: null,
        loading: true,
        loadingError: false
      };
    }
    case fromExchangeDashboardActions.LOADING_CHART_SUCCESS: {
      return {
        ...state,
        industryChartItems: action.payload,
        loading: false
      };
    }
    case fromExchangeDashboardActions.LOADING_CHART_ERROR: {
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

// Selector Functions
export const getExchange = (state: State) => state.exchange;
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getIndustryChartItems = (state: State) => state.industryChartItems;
