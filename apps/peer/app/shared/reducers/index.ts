import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromExchangeReducer from './exchange.reducer';
import * as fromPermissionReducer from './permissions.reducer';
import * as fromExchangeSelectorReducer from './exchange-selector.reducer';

// Feature area state
export interface SharedPeerState {
  exchange: fromExchangeReducer.State;
  exchangeAccess: fromPermissionReducer.State;
  exchangeSelector: fromExchangeSelectorReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  peer_shared: SharedPeerState;
}

// Feature area reducers
export const reducers = {
  exchange: fromExchangeReducer.reducer,
  exchangeAccess: fromPermissionReducer.reducer,
  exchangeSelector: fromExchangeSelectorReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<SharedPeerState>('peer_shared');

// Feature Selectors
export const selectExchangeState = createSelector(
  selectFeatureAreaState,
  (state: SharedPeerState) => state.exchange
);

export const selectAccessState = createSelector(
  selectFeatureAreaState,
  (state: SharedPeerState) => state.exchangeAccess
);

export const selectExchangeSelectorState = createSelector(
  selectFeatureAreaState,
  (state: SharedPeerState) => state.exchangeSelector
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

export const getExchangeStatus = createSelector(
  selectExchangeState,
  fromExchangeReducer.getExchangeStatus
);

export const {
  selectAll: getExchangeSelectorList
} = fromExchangeSelectorReducer.adapter.getSelectors(selectExchangeSelectorState);

export const getExchangeSelectorListLoading = createSelector(
  selectExchangeSelectorState,
  fromExchangeSelectorReducer.getLoading
);

export const getExchangeSelectorListLoaded = createSelector(
  selectExchangeSelectorState,
  fromExchangeSelectorReducer.getLoaded
);

export const getExchangeId = createSelector(
  getExchange,
  (exchange) => exchange ? exchange.ExchangeId : 0
);
export const getExchangeName = createSelector(
  getExchange,
  (exchange) => exchange ? exchange.ExchangeName : ''
);

// Exchange Access Selector
export const getExchangeAccess = createSelector(
  selectAccessState,
  fromPermissionReducer.getExchangeAccess
);
export const getExchangeAccessLoadAttempted = createSelector(
  selectAccessState,
  fromPermissionReducer.getExchangeAccessLoadingAttempted
);
export const getExchangeAccessLoading = createSelector(
  selectAccessState,
  fromPermissionReducer.getExchangeAccessLoading
);
export const getExchangeAccessLoadingError = createSelector(
  selectAccessState,
  fromPermissionReducer.getExchangeAccessLoadingError
);
