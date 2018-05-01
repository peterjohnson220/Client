import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromMapReducer from './map.reducer';
import * as fromFilterSidebarReducer from './filter-sidebar.reducer';
import { selectAddDataCutState } from '../../../../../apps/legacy-content/src/app/_peer/reducers';
import * as fromAddDataCutPageReducer
  from '../../../../../apps/legacy-content/src/app/_peer/reducers/add-data-cut-page.reducer';

// Feature area state
export interface PeerMapState {
  map: fromMapReducer.State;
  filterSidebar: fromFilterSidebarReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  peerMap: PeerMapState;
}

// Feature area reducers
export const reducers = {
  map: fromMapReducer.reducer,
  filterSidebar: fromFilterSidebarReducer.reducer
};

// Select Feature Area
export const selectPeerMapState = createFeatureSelector<PeerMapState>('feature_peerMap');

// Feature Selectors
export const selectMapState = createSelector(selectPeerMapState, (state: PeerMapState) => state.map);
export const selectPeerFiltersState = createSelector(selectPeerMapState, (state: PeerMapState) => state.filterSidebar);

// Map Data Selectors
export const getPeerMapLoading = createSelector(selectMapState, fromMapReducer.getLoading);
export const getPeerMapLoadingError = createSelector(selectMapState, fromMapReducer.getLoadingError);
export const getPeerMapSummary = createSelector(selectMapState, fromMapReducer.getMapSummary);
export const getPeerMapFilter = createSelector(selectMapState, fromMapReducer.getMapFilter);
export const getPeerMapCollection = createSelector(selectMapState, fromMapReducer.getMapCollection);
export const getPeerMapBounds = createSelector(selectMapState, fromMapReducer.getMapBounds);
export const getPeerMapMaxZoom = createSelector(selectMapState, fromMapReducer.getMaxZoom);
export const getPeerMapInitialMapMoveComplete = createSelector(selectMapState, fromMapReducer.getInitialMapMoveComplete);
export const canLoadPeerMap = createSelector(selectMapState, fromMapReducer.canLoadMap);
export const peerMapShowNoData = createSelector(selectMapState, fromMapReducer.showNoData);

// Filter Sidebar Selectors
export const getFilterAggregateGroupsLoading = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getLoading);
export const getFilterAggregateGroupsLoadingError = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getLoadingError);
export const getFilterAggregateGroups = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getFilterAggregateGroups);
export const getPeerFilterSelections = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getSelections);
export const getPeerFilterLimitToPayMarket = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getLimitToPayMarket);
export const getPeerFilterPayMarket = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getPayMarket);
export const getPeerFilterPreviewLimit = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getPreviewLimit);
export const getExchangeJobPayMarketFilter = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getExchangeJobPayMarketFilter);

// Combined State Selectors
export const getExchangeDataCutRequestData = createSelector(
  getExchangeJobPayMarketFilter,
  getPeerFilterSelections,
  getPeerMapFilter,
  getPeerFilterLimitToPayMarket,
  (ejpm, fs, pmf, pfltp) => {
    return {
      ...ejpm,
      ...fs,
      ...pmf,
      LimitToPayMarket: pfltp
    };
  });
