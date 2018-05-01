import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromExchangeReducer from 'libs/features/peer/list/reducers/exchange.reducer';

// Feature area state
export interface SharedPeerState {
  exchange: fromExchangeReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  sharedPeer: SharedPeerState;
}

// Feature area reducers
export const reducers = {
  exchange: fromExchangeReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<SharedPeerState>('peer_shared');

// Feature Selectors
export const selectExchangeState = createSelector(
  selectFeatureAreaState,
  (state: SharedPeerState) => state.exchange
);

// Exchange Selectors
export const getExchange = createSelector(
  selectExchangeState,
  fromExchangeReducer.getExchange
);
export const getExchangeLoading = createSelector(
  selectExchangeState,
  fromExchangeReducer.getLoading
);
export const getExchangeLoadingError = createSelector(
  selectExchangeState,
  fromExchangeReducer.getLoadingError
);
