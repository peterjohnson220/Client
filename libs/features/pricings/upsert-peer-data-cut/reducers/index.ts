import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromUpsertDataCutReducer from './upsert-peer-data-cut.reducer';
import * as fromRequestPeerAccessReducer from './request-peer-access.reducer';

export interface UpsertPeerDataCutState {
  upsertDataCut: fromUpsertDataCutReducer.State;
  requestPeerAccess: fromRequestPeerAccessReducer.State;
}

export interface State extends fromRoot.State {
  peer_upsertDataCut: UpsertPeerDataCutState;
}

export const reducers = {
  upsertDataCut: fromUpsertDataCutReducer.reducer,
  requestPeerAccess: fromRequestPeerAccessReducer.reducer
};

// Feature area
export const selectUpsertPeerDataCutState = createFeatureSelector<UpsertPeerDataCutState>('peer_upsertDataCut');

// Feature Selectors
export const selectUpsertDataCutState = createSelector(selectUpsertPeerDataCutState, (state: UpsertPeerDataCutState) => state.upsertDataCut);
export const selectRequestPeerAccessState = createSelector(selectUpsertPeerDataCutState, (state: UpsertPeerDataCutState) => state.requestPeerAccess);


// Upsert Data Cut
export const getUpsertDataCutAddingDataCut = createSelector(
  selectUpsertDataCutState,
  fromUpsertDataCutReducer.getUpsertingDataCut
);

export const getUpsertDataCutAddingDataCutError = createSelector(
  selectUpsertDataCutState,
  fromUpsertDataCutReducer.getUpsertingDataCutError
);

export const getUpsertDataCutInIframe = createSelector(
  selectUpsertDataCutState,
  fromUpsertDataCutReducer.getPageInViewInIframe
);

export const getLoadedDataCutDetails = createSelector(
  selectUpsertDataCutState,
  fromUpsertDataCutReducer.getLoadedDataCutDetails
);

// Request Peer Access
export const getRequestingPeerAccess = createSelector(
  selectRequestPeerAccessState,
  fromRequestPeerAccessReducer.getRequestingPeerAccess
);

export const getRequestingPeerAccessError = createSelector(
  selectRequestPeerAccessState,
  fromRequestPeerAccessReducer.getRequestingPeerAccessError
);
