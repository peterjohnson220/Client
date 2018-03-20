import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromAddDataCutPageReducer from './add-data-cut-page.reducer';
import * as fromMapReducer from './map.reducer';
import * as fromFilterSidebarReducer from './filter-sidebar.reducer';

// Feature area state
export interface PeerDataState {
  addDataCutPage: fromAddDataCutPageReducer.State;
  map: fromMapReducer.State;
  filterSidebar: fromFilterSidebarReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  peerData: PeerDataState;
}

// Feature area reducers
export const reducers = {
  addDataCutPage: fromAddDataCutPageReducer.reducer,
  map: fromMapReducer.reducer,
  filterSidebar: fromFilterSidebarReducer.reducer
};

// Select Feature Area
export const selectPeerDataState = createFeatureSelector<PeerDataState>('peerData');

// Feature Selectors
export const selectAddDataCutState = createSelector(selectPeerDataState, (state: PeerDataState) => state.addDataCutPage);
export const selectMapState = createSelector(selectPeerDataState, (state: PeerDataState) => state.map);
export const selectPeerFiltersState = createSelector(selectPeerDataState, (state: PeerDataState) => state.filterSidebar);

// Add Data Cut Selectors
export const getAddDataCutAddingDataCut = createSelector(selectAddDataCutState, fromAddDataCutPageReducer.getAddingDataCut);
export const getAddDataCutAddingDataCutError = createSelector(selectAddDataCutState, fromAddDataCutPageReducer.getAddingDataCutError);
export const getExchangeJobPayMarketFilter = createSelector(selectAddDataCutState, fromAddDataCutPageReducer.getExchangeJobPayMarketFilter);

// Map Data Selectors
export const getPeerMapLoading = createSelector(selectMapState, fromMapReducer.getLoading);
export const getPeerMapLoadingError = createSelector(selectMapState, fromMapReducer.getLoadingError);
export const getPeerMapSummary = createSelector(selectMapState, fromMapReducer.getMapSummary);
export const getPeerMapFilter = createSelector(selectMapState, fromMapReducer.getMapFilter);
export const getPeerMapCollection = createSelector(selectMapState, fromMapReducer.getMapCollection);
export const getPeerMapBounds = createSelector(selectMapState, fromMapReducer.getMapBounds);
export const getPeerMapMaxZoom = createSelector(selectMapState, fromMapReducer.getMaxZoom);
export const getPeerMapIsInitialLoad = createSelector(selectMapState, fromMapReducer.getIsInitialLoad);
export const canLoadPeerMap = createSelector(selectMapState, fromMapReducer.canLoadMap);
export const peerMapShowNoData = createSelector(selectMapState, fromMapReducer.showNoData);

// Filter Sidebar Selectors
export const {
  selectAll: getFilterAggregateGroups
} = fromFilterSidebarReducer.adapter.getSelectors(selectPeerFiltersState);

export const getFilterAggregateGroupsLoading = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getLoading);
export const getFilterAggregateGroupsLoadingError = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getLoadingError);
export const getPeerFilterSelections = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getSelections);
export const getPeerFilterLimitToPayMarket = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getLimitToPayMarket);
export const getPeerFilterPayMarket = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getPayMarket);


// Combined State Selectors
export const getExchangeDataCutRequestData = createSelector(
  getExchangeJobPayMarketFilter,
  getPeerFilterSelections,
  getPeerMapFilter,
  getPeerFilterLimitToPayMarket,
  (ejpmf, fs, pmf, pfltp) => {
    return {
      ...ejpmf,
      ...fs,
      ...pmf,
      LimitToPayMarket: pfltp
    };
  });
