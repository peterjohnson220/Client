import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromExchangeListReducer from './exchange-list.reducer';

// Feature area state
export interface PeerAdminState {
  exchangeList: fromExchangeListReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  peerAdmin: PeerAdminState;
}

// Feature area reducers
export const reducers = {
  exchangeList: fromExchangeListReducer.reducer
};

// Select Feature Area
export const selectPeerAdminState = createFeatureSelector<PeerAdminState>('peerAdmin');

// Feature Selectors
export const selectExchangeListState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.exchangeList);

// Entity Adapter Selectors
export const {
  selectIds: getExchangeListItemIds,
  selectEntities: getExchangeLisItemsDictionary,
  selectAll: getExchangeListItems,
  selectTotal: getExchangeListItemsTotal
} = fromExchangeListReducer.adapter.getSelectors(selectExchangeListState);

export const getExchangeListLoading = createSelector(
    selectExchangeListState, fromExchangeListReducer.getLoading
);

export const getExchangeListLoadingError = createSelector(
  selectExchangeListState, fromExchangeListReducer.getLoadingError
);

export const getExchangeListUpserting = createSelector(
  selectExchangeListState, fromExchangeListReducer.getUpserting
);

export const getExchangeListUpsertingError = createSelector(
  selectExchangeListState, fromExchangeListReducer.getUpsertingError
);

export const getExchangeListUpsertingErrorMessage = createSelector(
  selectExchangeListState, fromExchangeListReducer.getUpsertingErrorMessage
);
export const getExchangeListCreateExchangeModalOpen = createSelector(
  selectExchangeListState, fromExchangeListReducer.getCreateExchangeModalOpen
);



