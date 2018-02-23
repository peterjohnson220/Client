import { ChartItem } from 'libs/models';

import * as fromExchangeDashboardActions from '../actions/exchange-dashboard.actions';

export interface State {
  loadingIndustryChart: boolean;
  loadingIndustryChartError: boolean;
  industryChartItems: ChartItem[];
}

// Initial State
export const initialState: State = {
  loadingIndustryChart: false,
  loadingIndustryChartError: false,
  industryChartItems: null
};

// Reducer
export function reducer(
  state = initialState,
  action: fromExchangeDashboardActions.Actions
): State {
  switch (action.type) {
    case fromExchangeDashboardActions.LOADING_CHART: {
      return {
        ...state,
        industryChartItems: null,
        loadingIndustryChart: true,
        loadingIndustryChartError: false
      };
    }
    case fromExchangeDashboardActions.LOADING_CHART_SUCCESS: {
      return {
        ...state,
        industryChartItems: action.payload,
        loadingIndustryChart: false,
        loadingIndustryChartError: false
      };
    }
    case fromExchangeDashboardActions.LOADING_CHART_ERROR: {
      return {
        ...state,
        loadingIndustryChart: false,
        loadingIndustryChartError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getIndustryChartItems = (state: State) => state.industryChartItems;
export const getLoadingIndustryChart = (state: State) => state.loadingIndustryChart;
export const getLoadingIndustryChartError = (state: State) => state.loadingIndustryChartError;
