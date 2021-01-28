import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromECommerceReducer from './ecommerce.reducer';

// Feature area state
export interface ECommerceState {
  ecommerce: fromECommerceReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_ecommerce: ECommerceState;
}

// Feature area reducers
export const reducers = {
  ecommerce: fromECommerceReducer.reducer
};

// Select feature area
export const selectFeatureAreaState =
  createFeatureSelector<ECommerceState>('feature_ecommerce');

// Selectors
export const selectECommerceState = createSelector(
  selectFeatureAreaState,
  (state: ECommerceState) => state.ecommerce
);

// ECommerce
export const getSettingsAsyncObj = createSelector(
  selectECommerceState, fromECommerceReducer.getSettingsAsyncObj
);
