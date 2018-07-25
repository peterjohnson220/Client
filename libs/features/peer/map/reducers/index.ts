import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromMapReducer from './map.reducer';
import * as fromFilterSidebarReducer from './filter-sidebar.reducer';
import * as fromExchangeScopeReducer from './exchange-scope.reducer';

// Feature area state
export interface LibsPeerMapState {
  map: fromMapReducer.State;
  filterSidebar: fromFilterSidebarReducer.State;
  exchangeScope: fromExchangeScopeReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_peerMap: LibsPeerMapState;
}

// Feature area reducers
export const reducers = {
  map: fromMapReducer.reducer,
  filterSidebar: fromFilterSidebarReducer.reducer,
  exchangeScope: fromExchangeScopeReducer.reducer
};

// Select Feature Area
export const selectLibsPeerMapState = createFeatureSelector<LibsPeerMapState>('feature_peerMap');

// Feature Selectors
export const selectMapState = createSelector(selectLibsPeerMapState, (state: LibsPeerMapState) => state.map);
export const selectPeerFiltersState = createSelector(selectLibsPeerMapState, (state: LibsPeerMapState) => state.filterSidebar);
export const selectExchangeScopeState = createSelector(selectLibsPeerMapState, (state: LibsPeerMapState) => state.exchangeScope);

// Map Data Selectors
export const getPeerMapLoading = createSelector(selectMapState, fromMapReducer.getLoading);
export const getPeerMapLoadingError = createSelector(selectMapState, fromMapReducer.getLoadingError);
export const getPeerMapSummary = createSelector(selectMapState, fromMapReducer.getMapSummary);
export const getPeerMapFilter = createSelector(selectMapState, fromMapReducer.getMapFilter);
export const getPeerMapCollection = createSelector(selectMapState, fromMapReducer.getMapCollection);
export const getPeerMapBounds = createSelector(selectMapState, fromMapReducer.getMapBounds);
export const getPeerMapMaxZoom = createSelector(selectMapState, fromMapReducer.getMaxZoom);
export const getPeerMapInitialMapMoveComplete = createSelector(selectMapState, fromMapReducer.getInitialMapMoveComplete);
export const getPeerMapInitialZoomLevel = createSelector(selectMapState, fromMapReducer.getInitialZoomLevel);
export const getPeerMapCentroid = createSelector(selectMapState, fromMapReducer.getMapCentroid);
export const canLoadPeerMap = createSelector(selectMapState, fromMapReducer.canLoadMap);
export const peerMapShowNoData = createSelector(selectMapState, fromMapReducer.showNoData);
export const getPeerMapApplyingScope = createSelector(selectMapState, fromMapReducer.getApplyingScope);

// Filter Sidebar Selectors
export const getFilterAggregateGroupsLoading = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getLoading);
export const getFilterAggregateGroupsLoadingError = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getLoadingError);
export const getFilterAggregateGroups = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getFilterAggregateGroups);
export const getPeerFilterSelections = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getSelections);
export const getPeerFilterLimitToPayMarket = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getLimitToPayMarket);
export const getPeerFilterPayMarket = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getPayMarket);
export const getPeerFilterPreviewLimit = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getPreviewLimit);
export const getSystemFilter = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getSystemFilter);
export const getPeerFilterSelectionsCount = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getSelectionsCount);
export const getPeerFilterScopeSelection = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getScopeSelection);

// Exchange Scope Selectors
export const {
  selectAll: getExchangeScopes
} = fromExchangeScopeReducer.adapter.getSelectors(selectExchangeScopeState);
export const getExchangeScopesLoading = createSelector(selectExchangeScopeState, fromExchangeScopeReducer.getLoading);
export const getExchangeScopesLoadingError = createSelector(selectExchangeScopeState, fromExchangeScopeReducer.getLoadingError);
export const getExchangeScopeDetailsLoading = createSelector(selectExchangeScopeState, fromExchangeScopeReducer.getLoadingDetails);
export const getExchangeScopeDetailsLoadingError = createSelector(
  selectExchangeScopeState,
  fromExchangeScopeReducer.getLoadingDetailsError
);

// Combined State Selectors
export const getExchangeDataCutRequestData = createSelector(
  getSystemFilter,
  getPeerFilterSelections,
  getPeerMapFilter,
  getPeerFilterLimitToPayMarket,
  (sf, fs, pmf, pfltp) => {
    return {
        ...sf,
        ...fs,
        ...pmf,
        LimitToPayMarket: pfltp
    };
  });

export const getUpsertDataCutRequestData = createSelector(
  getExchangeDataCutRequestData,
  getPeerFilterPayMarket,
  (filterDetails, paymarketDetails) => {
    return {
      FilterDetails: filterDetails,
      PayMarketDetails: {
        CompanyPayMarketId: paymarketDetails ? paymarketDetails.CompanyPayMarketId : null,
        PayMarketName: paymarketDetails ? paymarketDetails.PayMarket : null
      }
    };
  }
);

export const getNumberOfCompanySelections = createSelector(
  getPeerFilterSelections,
  (filterSelections) => !!filterSelections['CompanyIds'] ? filterSelections['CompanyIds'].length : 0
);

export const getSystemFilterExchangeJobIds = createSelector(
  getSystemFilter,
  (systemFilter) => !!systemFilter ? systemFilter.ExchangeJobIds : []
);

export const getPeerMapScopeRequestPayload = createSelector(
  getExchangeDataCutRequestData,
  getPeerFilterScopeSelection,
  (filterModel, selectedExchangeScope) => {
    return {
      filterModel,
      exchangeScopeGuid: !!selectedExchangeScope ? selectedExchangeScope.Id : null
    };
  }
);

export const getSystemFilterLoaded = createSelector(getSystemFilter, (systemFilter) => !!systemFilter);

