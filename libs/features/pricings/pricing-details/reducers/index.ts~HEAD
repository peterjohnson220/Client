import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromPricingDetailsReducer from './pricing-details.reducer';

// Feature area state
export interface PricingDetailsState {
  pricingDetails: fromPricingDetailsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_pricing_details: PricingDetailsState;
}

// Feature area reducers
export const reducers = {
  pricingDetails: fromPricingDetailsReducer.reducer
};

// Select Feature Area
export const selectPricingDetailsFeature =
  createFeatureSelector<PricingDetailsState>('feature_pricing_details');

// View Selectors
export const selectPricingDetailsState =
  createSelector(selectPricingDetailsFeature, (state: PricingDetailsState) => state.pricingDetails);

// Company Info
export const getState = createSelector(selectPricingDetailsState, fromPricingDetailsReducer.getState);
export const getLoading = createSelector(selectPricingDetailsState, fromPricingDetailsReducer.getLoading);
export const getNewStatus = createSelector(selectPricingDetailsState, fromPricingDetailsReducer.getNewStatus);
export const getPricingInfo = createSelector(selectPricingDetailsState, fromPricingDetailsReducer.getPricingInfo);
export const getAddingToNewProject = createSelector(selectPricingDetailsState, fromPricingDetailsReducer.getAddingToNewProject);
export const getSavingPricing = createSelector(selectPricingDetailsState, fromPricingDetailsReducer.getSavingPricing);

