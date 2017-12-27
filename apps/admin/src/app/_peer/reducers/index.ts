import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromExchangeListReducer from './exchange-list.reducer';
import * as fromManageExchangeReducer from './manage-exchange.reducer';
import * as fromExchangeCompaniesReducer from './exchange-companies.reducer';
import * as fromAvailableCompaniesReducer from './available-companies.reducer';

// Feature area state
export interface PeerAdminState {
  exchangeList: fromExchangeListReducer.State;
  manageExchange: fromManageExchangeReducer.State;
  exchangeCompanies: fromExchangeCompaniesReducer.State;
  availableCompanies: fromAvailableCompaniesReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  peerAdmin: PeerAdminState;
}

// Feature area reducers
export const reducers = {
  exchangeList: fromExchangeListReducer.reducer,
  manageExchange: fromManageExchangeReducer.reducer,
  exchangeCompanies: fromExchangeCompaniesReducer.reducer,
  availableCompanies: fromAvailableCompaniesReducer.reducer,
};

// Select Feature Area
export const selectPeerAdminState = createFeatureSelector<PeerAdminState>('peerAdmin');

// Feature Selectors
export const selectExchangeListState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.exchangeList);
export const selectManageExchangeState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.manageExchange);
export const selectExchangeCompaniesState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.exchangeCompanies);
export const selectAvailableCompaniesState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.availableCompanies);

// Exchange List Selectors
export const {
  selectAll: getExchangeListItems,
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


// Manage Exchange Selectors
export const getManageExchange = createSelector(selectManageExchangeState, fromManageExchangeReducer.getExchange);
export const getManageExchangeLoading = createSelector(selectManageExchangeState, fromManageExchangeReducer.getLoading);
export const getManageExchangeLoadingError = createSelector(selectManageExchangeState, fromManageExchangeReducer.getLoadingError);

// Exchange Companies Selectors
// Exchange List Selectors
export const {
  selectAll: getExchangeCompanies
} = fromExchangeCompaniesReducer.adapter.getSelectors(selectExchangeCompaniesState);

export const getExchangeCompaniesLoading = createSelector(selectExchangeCompaniesState, fromExchangeCompaniesReducer.getLoading);
export const getExchangeCompaniesLoadingError = createSelector(selectExchangeCompaniesState, fromExchangeCompaniesReducer.getLoadingError);

// Available Companies Selectors
export const {
  selectAll: getAvailableCompanies,

} = fromAvailableCompaniesReducer.adapter.getSelectors(selectAvailableCompaniesState);

export const getAvailableCompaniesLoading = createSelector(selectAvailableCompaniesState, fromAvailableCompaniesReducer.getLoading);
export const getAvailableCompaniesLoadingError = createSelector(selectAvailableCompaniesState, fromAvailableCompaniesReducer.getLoadingError);
export const getTotalAvailableCompanies = createSelector(selectAvailableCompaniesState, fromAvailableCompaniesReducer.getTotal);
export const getAvailableCompaniesGrid = createSelector(
  getAvailableCompanies,
  getTotalAvailableCompanies,
  (data, total) => {
    return {data: data, total: total};
  }
);
