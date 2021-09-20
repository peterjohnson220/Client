import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromJobPricingGraphReducer from './job-pricing-graph.reducer';

// Feature area state
export interface JobPricingGraphState {
  JobPricingGraphData: fromJobPricingGraphReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_job_pricing_graph: JobPricingGraphState;
}

// Feature area reducers
export const reducers = {
  JobPricingGraphData: fromJobPricingGraphReducer.reducer
};

// Select Feature Area
export const selectJobPricingGraphFeature =
  createFeatureSelector<JobPricingGraphState>('feature_job_pricing_graph');

// View Selectors
export const selectJobPricingGraphState =
  createSelector(selectJobPricingGraphFeature, (state: JobPricingGraphState) => state.JobPricingGraphData);

// JobPricingGraph
export const getState = createSelector(selectJobPricingGraphState, fromJobPricingGraphReducer.getState);
export const getEmployeePayData = createSelector(selectJobPricingGraphState, fromJobPricingGraphReducer.getEmployeePayData);
export const getBasePayPricing = createSelector(selectJobPricingGraphState, fromJobPricingGraphReducer.getBasePayPricing);
export const getTCCPricing = createSelector(selectJobPricingGraphState, fromJobPricingGraphReducer.getTCCPricing);
