import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromExchangeListReducer from './exchange-list.reducer';
import * as fromManageExchangeReducer from './manage-exchange.reducer';

// Feature area state
export interface PeerAdminState {
  exchangeList: fromExchangeListReducer.State;
  manageExchange: fromManageExchangeReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  peerAdmin: PeerAdminState;
}

// Feature area reducers
export const reducers = {
  exchangeList: fromExchangeListReducer.reducer,
  manageExchange: fromManageExchangeReducer.reducer
};

// Select Feature Area
export const selectPeerAdminState = createFeatureSelector<PeerAdminState>('peerAdmin');

// Feature Selectors
export const selectExchangeListState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.exchangeList);
export const selectManageExchangeState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.manageExchange);

// Exchange List Selectors
export const {
  selectIds: getExchangeListItemIds,
  selectEntities: getExchangeLisItemsDictionary,
  selectAll: getExchangeListItems,
  selectTotal: getExchangeListItemsTotal
} = fromExchangeListReducer.adapter.getSelectors(selectExchangeListState);

export const getExchangeListLoading = createSelector(selectExchangeListState, fromExchangeListReducer.getLoading);
export const getExchangeListLoadingError = createSelector(selectExchangeListState, fromExchangeListReducer.getLoadingError);


// Manage Exchange Selectors
export const getManageExchange = createSelector(selectManageExchangeState, fromManageExchangeReducer.getExchange);
export const getManageExchangeLoading = createSelector(selectManageExchangeState, fromManageExchangeReducer.getLoading);
export const getManageExchangeLoadingError = createSelector(selectManageExchangeState, fromManageExchangeReducer.getLoadingError);


