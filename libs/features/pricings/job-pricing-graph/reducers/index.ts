import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromBasePayGraphReducer from './job-pricing-graph.reducer';

// Feature area state
export interface BasePayGraphState {
  BasePayGraphData: fromBasePayGraphReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_base_pay_graph: BasePayGraphState;
}

// Feature area reducers
export const reducers = {
  BasePayGraphData: fromBasePayGraphReducer.reducer
};

// Select Feature Area
export const selectBasePayGraphFeature =
  createFeatureSelector<BasePayGraphState>('feature_base_pay_graph');

// View Selectors
export const selectBasePayGraphState =
  createSelector(selectBasePayGraphFeature, (state: BasePayGraphState) => state.BasePayGraphData);

// BasePayGraph
export const getState = createSelector(selectBasePayGraphState, fromBasePayGraphReducer.getState);
export const getBasePay = createSelector(selectBasePayGraphState, fromBasePayGraphReducer.getBasePay);
export const getPricing = createSelector(selectBasePayGraphState, fromBasePayGraphReducer.getPricing);
