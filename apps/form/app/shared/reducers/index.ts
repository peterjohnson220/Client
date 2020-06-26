import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromSharedReducer from './shared.reducer';
import * as fromPeerExchangeSignupReducer from './peer-exchange-signup.reducer';

// Feature area state
export interface FormSharedState {
  shared: fromSharedReducer.State;
  peer_exchange_signup: fromPeerExchangeSignupReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  form_shared: FormSharedState;
}

// Feature area reducers
export const reducers = {
  shared: fromSharedReducer.reducer,
  peer_exchange_signup: fromPeerExchangeSignupReducer.reducer
};

// Select feature area
export const selectFeatureAreaState =
  createFeatureSelector<FormSharedState>('form_shared');

// Selectors
export const selectSharedState = createSelector(
  selectFeatureAreaState,
  (state: FormSharedState) => state.shared
);

export const selectPeerExchangeSignupState = createSelector(
  selectFeatureAreaState,
  (state: FormSharedState) => state.peer_exchange_signup
);

// Shared
export const getSubmittingFormAsyncObj = createSelector(
  selectSharedState, fromSharedReducer.getSubmittingFormAsyncObj
);

export const getRootFormModelValue = createSelector(
  selectSharedState, fromSharedReducer.getRootFormModelValue
);

// Peer exchange signup
export const getExchangeSignupCompaniesAsyncObj = createSelector(
  selectPeerExchangeSignupState, fromPeerExchangeSignupReducer.getExchangeSignupCompaniesAsyncObj
);
