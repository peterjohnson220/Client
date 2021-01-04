import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromPricingHistoryChartReducer from './pricing-history-chart.reducer';

// Feature area state
export interface PricingHistoryChartState {
  pricingHistoryChartData: fromPricingHistoryChartReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_pricing_history_chart: PricingHistoryChartState;
}

// Feature area reducers
export const reducers = {
  pricingHistoryChartData: fromPricingHistoryChartReducer.reducer
};

// Select Feature Area
export const selectPricingHistoryChartFeature =
  createFeatureSelector<PricingHistoryChartState>('feature_pricing_history_chart');

// View Selectors
export const selectPricingHistoryChartState =
  createSelector(selectPricingHistoryChartFeature, (state: PricingHistoryChartState) => state.pricingHistoryChartData);

// PricingHistoryChart
export const getState = createSelector(selectPricingHistoryChartState, fromPricingHistoryChartReducer.getState);
export const getJobId = createSelector(selectPricingHistoryChartState, fromPricingHistoryChartReducer.getJobId);
export const getPricedPayMarkets = createSelector(selectPricingHistoryChartState, fromPricingHistoryChartReducer.getPricedPayMarkets);
export const getFilters = createSelector(selectPricingHistoryChartState, fromPricingHistoryChartReducer.getFilters);
export const getData = createSelector(selectPricingHistoryChartState, fromPricingHistoryChartReducer.getData);
