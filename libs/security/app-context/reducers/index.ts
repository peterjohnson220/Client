import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromIdentityReducer from './identity.reducer';

export interface AppContextState {
  identity: fromIdentityReducer.State;
}

export interface State {
  appContext: AppContextState;
}

export const reducers = {
  identity: fromIdentityReducer.reducer
};


export const selectAppContextState = createFeatureSelector<AppContextState>('appContext');


export const selectAppContextIdentityState = createSelector(
  selectAppContextState,
  (state: AppContextState) => state.identity
);

export const getGettingIdentity = createSelector(selectAppContextIdentityState, fromIdentityReducer.getGettingIdentity);
export const getGettingIdentityError = createSelector(selectAppContextIdentityState, fromIdentityReducer.getGettingIdentityError);
export const getIdentity = createSelector(selectAppContextIdentityState, fromIdentityReducer.getIdentity);
