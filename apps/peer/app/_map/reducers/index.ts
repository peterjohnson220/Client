import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromExchangeScopeReducer from './exchange-scope.reducer';

// Feature area state
export interface PeerMapState {
  exchangeScope: fromExchangeScopeReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  peer_map: PeerMapState;
}

// Feature area reducers
export const reducers = {
  exchangeScope: fromExchangeScopeReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<PeerMapState>('peer_map');

// Exchange Scope Selectors
export const selectExchangeScopeState = createSelector(
  selectFeatureAreaState,
  (state: PeerMapState) => state.exchangeScope
);

export const getExchangeScopeUpserting = createSelector(
  selectExchangeScopeState,
  fromExchangeScopeReducer.getUpserting
);

export const getExchangeScopeUpsertingError = createSelector(
  selectExchangeScopeState,
  fromExchangeScopeReducer.getUpsertingError
);

export const getSaveExchangeScopeModalOpen = createSelector(
  selectExchangeScopeState,
  fromExchangeScopeReducer.getSaveModalOpen
);
