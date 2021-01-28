import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromPricingMatchReducer from './pricing-match.reducer';

// Feature area state
export interface PricingMatchState {
  pricingMatch: fromPricingMatchReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_exchangeDataCuts: PricingMatchState;
}

// Feature area reducers
export const reducers = {
  pricingMatch: fromPricingMatchReducer.reducer
};

// Select Feature Area
export const selectPricingMatchFeature =
  createFeatureSelector<PricingMatchState>('feature_pricingMatch');

// View Selectors
export const selectPricingMatchState =
  createSelector(selectPricingMatchFeature, (state: PricingMatchState) => state.pricingMatch);

export const getPricingMatch = createSelector(selectPricingMatchState, fromPricingMatchReducer.getPricingMatch);
export const getLoading = createSelector(selectPricingMatchState, fromPricingMatchReducer.getLoading);
export const getHasError = createSelector(selectPricingMatchState, fromPricingMatchReducer.getHasError);
