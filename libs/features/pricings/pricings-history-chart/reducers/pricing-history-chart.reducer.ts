import cloneDeep from 'lodash/cloneDeep';

import * as fromPricingHistoryChartActions from '../actions/pricing-history-chart.actions';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';
import { PricedPayMarkets, PricingHistoryChartFilters } from 'libs/models/payfactors-api';

export interface State {
  jobId: number;
  pricedPayMarkets: AsyncStateObj<PricedPayMarkets[]>;
  filters: PricingHistoryChartFilters;
}

export const initialState: State = {
  jobId: null,
  pricedPayMarkets: generateDefaultAsyncStateObj<PricedPayMarkets[]>([]),
  filters: null
};

export function reducer(state = initialState, action: fromPricingHistoryChartActions.Actions): State {
  switch (action.type) {
    case fromPricingHistoryChartActions.UPDATE_JOB_ID: {
      return {
        ...state,
        jobId: action.jobId
      };
    }
    case fromPricingHistoryChartActions.LOAD_PRICED_PAYMARKETS: {
      return AsyncStateObjHelper.loading(state, 'pricedPayMarkets');
    }
    case fromPricingHistoryChartActions.LOAD_PRICED_PAYMARKETS_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'pricedPayMarkets', action.payload);
    }
    case fromPricingHistoryChartActions.LOAD_PRICED_PAYMARKETS_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'pricedPayMarkets');
    }
    case fromPricingHistoryChartActions.UPDATE_FILTERS:
      return {
        ...state,
        filters: cloneDeep(action.payload)
      };
    default:
      return state;
  }
}

export const getState = (state: State) => state;
export const getJobId = (state: State) => state.jobId;
export const getPricedPayMarkets = (state: State) => state.pricedPayMarkets;
export const getFilters = (state: State) => state.filters;
