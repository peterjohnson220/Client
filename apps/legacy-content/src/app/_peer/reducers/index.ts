import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromPeerMapReducer from './peer-map.reducer';

// Feature area state
export interface PeerDataState {
  map: fromPeerMapReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  peerData: PeerDataState;
}

// Feature area reducers
export const reducers = {
  map: fromPeerMapReducer.reducer
};

// Select Feature Area
export const selectPeerPeerDataState = createFeatureSelector<PeerDataState>('peerData');

// Feature Selectors
export const selectMapState = createSelector(selectPeerPeerDataState, (state: PeerDataState) => state.map);

// Map Data Selectors
export const getPeerMapLoading = createSelector(selectMapState, fromPeerMapReducer.getLoading);
export const getPeerMapLoadingError = createSelector(selectMapState, fromPeerMapReducer.getLoadingError);
export const getPeerMapSummary = createSelector(selectMapState, fromPeerMapReducer.getMapSummary);
export const getPeerMapFilter = createSelector(selectMapState, fromPeerMapReducer.getMapFilter);
export const getPeerMapCollection = createSelector(selectMapState, fromPeerMapReducer.getMapCollection);
export const getPeerMapBounds = createSelector(selectMapState, fromPeerMapReducer.getMapBounds);
export const canLoadPeerMap = createSelector(selectMapState, fromPeerMapReducer.canLoadMap);
