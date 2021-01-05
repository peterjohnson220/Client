import cloneDeep from 'lodash/cloneDeep';
import orderBy from 'lodash/orderBy';

import * as fromPricingHistoryChartActions from '../actions/pricing-history-chart.actions';
import { AsyncStateObj, CurrencyDto, generateDefaultAsyncStateObj, KendoTypedDropDownItem, KendoTypedDropDownItemHelper } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';
import { PricedPayMarkets, PricingHistoryChartFilters, PayMarketPricingHistory } from 'libs/models/payfactors-api';

export interface State {
  jobId: number;
  pricedPayMarkets: AsyncStateObj<PricedPayMarkets[]>;
  currencies: KendoTypedDropDownItem[];
  filters: PricingHistoryChartFilters;
  data: AsyncStateObj<PayMarketPricingHistory[]>;
}

export const initialState: State = {
  jobId: null,
  pricedPayMarkets: generateDefaultAsyncStateObj<PricedPayMarkets[]>([]),
  currencies: [],
  filters: null,
  data: generateDefaultAsyncStateObj<PayMarketPricingHistory[]>([]),
};

export function reducer(state = initialState, action: fromPricingHistoryChartActions.Actions): State {
  switch (action.type) {
    case fromPricingHistoryChartActions.UPDATE_JOB_ID: {
      return {
        ...state,
        jobId: action.jobId
      };
    }
    case fromPricingHistoryChartActions.INIT_PRICING_HISTORY_CHART: {
      return AsyncStateObjHelper.loading(state, 'pricedPayMarkets');
    }
    case fromPricingHistoryChartActions.INIT_PRICING_HISTORY_CHART_SUCCESS: {
      return {
        ...state,
        pricedPayMarkets: { ...state.pricedPayMarkets, loading: false, obj: formatPayMarkets(action.payload[0]) },
        data: { ...state.data, obj: [] },
        currencies: KendoTypedDropDownItemHelper.mapItemsToDropdownList(
          action.payload[1],'CurrencyCode', (item => {return `${item.CurrencyCode} - ${item.CurrencyName}`;}))
      };
    }
    case fromPricingHistoryChartActions.INIT_PRICING_HISTORY_CHART_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'pricedPayMarkets');
    }
    case fromPricingHistoryChartActions.UPDATE_FILTERS:
      return {
        ...state,
        filters: cloneDeep(action.payload)
      };
    case fromPricingHistoryChartActions.GET_DATA: {
      return AsyncStateObjHelper.loading(state, 'data');
    }
    case fromPricingHistoryChartActions.GET_DATA_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'data', action.payload);
    }
    case fromPricingHistoryChartActions.GET_DATA_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'data');
    }
    default:
      return state;
  }
}

export const getState = (state: State) => state;
export const getJobId = (state: State) => state.jobId;
export const getPricedPayMarkets = (state: State) => state.pricedPayMarkets;
export const getCurrencies = (state: State) => state.currencies;
export const getFilters = (state: State) => state.filters;
export const getData = (state: State) => state.data;

export function formatPayMarkets(pricedPayMarkets: PricedPayMarkets[]) {
  if (pricedPayMarkets) {
    const defaultPMs = pricedPayMarkets.filter(p => p.IsDefault);
    let sortedPayMarkets = pricedPayMarkets.filter(p => !p.IsDefault);
    sortedPayMarkets = orderBy(sortedPayMarkets, 'Name', 'asc');
    sortedPayMarkets = defaultPMs.concat(sortedPayMarkets);

    return sortedPayMarkets;
  }

  return pricedPayMarkets;
}
