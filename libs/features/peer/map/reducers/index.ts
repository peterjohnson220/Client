import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromMapReducer from './map.reducer';
import * as fromFilterSidebarReducer from './filter-sidebar.reducer';
import * as fromExchangeScopeReducer from './exchange-scope.reducer';
import {ExchangeStatCompanyMakeup} from '../../../../models/peer';
import {getExchangeJobFilterOptions} from '../../exchange-explorer/reducers';

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
export const getPeerMapCompaniesFromSummary = createSelector(
  getPeerMapSummary,
  (summary) => !!summary ? summary.OverallMapStats.Companies : []
);
export const getPeerMapExchangeJobIdsFromSummary = createSelector(
  getPeerMapSummary,
  (summary) => !!summary ? summary.OverallMapStats.ExchangeJobIds : []
);
export const getPeerMapCompaniesCount = createSelector(
  getPeerMapCompaniesFromSummary,
  (companies: ExchangeStatCompanyMakeup[]) => !companies ? 0 : companies.length
);
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
export const getPeerMapAutoZooming = createSelector(selectMapState, fromMapReducer.getAutoZooming);
export const getLoadingEditDataCut = createSelector(selectMapState, fromMapReducer.getLoadingEditDataCut);

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
export const getAssociatedExchangeJobs = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getAssociatedExchangeJobs);
export const getSearchingAggregate = createSelector(selectPeerFiltersState, fromFilterSidebarReducer.getSearchingAggregate);
export const getSelectedExchangeJobId = createSelector(
  getSystemFilter,
  (systemFilter) => {
    if (!systemFilter) {
      return 0;
    }
    const exchangeJobId = !!systemFilter.LockedExchangeJobId ? systemFilter.LockedExchangeJobId : systemFilter.ExchangeJobId;
    return !!exchangeJobId ? exchangeJobId : 0;
  }
);

export const getPeerFilterIncludeUntaggedIncumbents = createSelector(
  selectPeerFiltersState,
  fromFilterSidebarReducer.getIncludeUntaggedIncumbents
);
export const getPeerFilterExcludeIndirectJobMatches = createSelector(
  selectPeerFiltersState,
  fromFilterSidebarReducer.getExcludeIndirectJobMatches
);
export const getPeerFilterCountUnGeoTaggedIncumbents = createSelector(
  selectPeerFiltersState,
  fromFilterSidebarReducer.getCountUntaggedIncumbents
);
export const getPeerFilterHasSimilarJobLevels = createSelector(
  selectPeerFiltersState,
  fromFilterSidebarReducer.getHasSimilarJobLevels
);

// Exchange Scope Selectors
export const {
  selectAll: getExchangeScopesSrc
} = fromExchangeScopeReducer.adapter.getSelectors(selectExchangeScopeState);
export const getExchangeScopes = createSelector(
  getExchangeScopesSrc,
  getAssociatedExchangeJobs,
  getSelectedExchangeJobId,
  (scopes, exchangeJobOptions, selectedExchangeJobId) => {
    if (!scopes || !scopes.length) {
      return [];
    }

    if (!exchangeJobOptions) {
      return scopes;
    }

    const selectedExchangeJobExchangeDetail = exchangeJobOptions.find(ejo => ejo.ExchangeJobId === selectedExchangeJobId);
    if (!selectedExchangeJobExchangeDetail) {
      return scopes;
    }

    return scopes.filter(s => s.ExchangeId === selectedExchangeJobExchangeDetail.ExchangeId);
  }
);
export const getExchangeScopesLoadingByJobs = createSelector(selectExchangeScopeState, fromExchangeScopeReducer.getLoadingByJobs);
export const getExchangeScopesLoadingByJobsError = createSelector(selectExchangeScopeState, fromExchangeScopeReducer.getLoadingByJobsError);
export const getExchangeScopesLoadingByExchange = createSelector(selectExchangeScopeState, fromExchangeScopeReducer.getLoadingByExchange);
export const getExchangeScopesLoadingByExchangeError =
  createSelector(selectExchangeScopeState, fromExchangeScopeReducer.getLoadingByExchangeError);
export const getExchangeScopeDetailsLoading = createSelector(selectExchangeScopeState, fromExchangeScopeReducer.getLoadingDetails);
export const getExchangeScopeDetailsLoadingError = createSelector(
  selectExchangeScopeState,
  fromExchangeScopeReducer.getLoadingDetailsError
);
export const getDeletingExchangeScope = createSelector(selectExchangeScopeState, fromExchangeScopeReducer.getDeletingScope);
export const getDeletingExchangeScopeError = createSelector(selectExchangeScopeState, fromExchangeScopeReducer.getDeletingScopeError);
export const getInDeleteExchangeScopeMode = createSelector(selectExchangeScopeState, fromExchangeScopeReducer.getInDeleteScopeMode);
export const getExchangeScopeToDelete = createSelector(selectExchangeScopeState, fromExchangeScopeReducer.getExchangeScopeToDelete);

// Combined State Selectors
export const getExchangeDataCutRequestData = createSelector(
  getSystemFilter,
  getPeerFilterSelections,
  getPeerMapFilter,
  getPeerFilterLimitToPayMarket,
  getPeerFilterIncludeUntaggedIncumbents,
  getPeerFilterExcludeIndirectJobMatches,
  getPeerFilterScopeSelection,
  (sf, fs, pmf, pfltp, includeUntaggedIncumbents, isExcludingIndirectJobMatches, selectedExchangeScope) => {
    return {
        ...sf,
        ...fs,
        ...pmf,
        LimitToPayMarket: pfltp,
        IncludeUntaggedIncumbents: includeUntaggedIncumbents,
        // We store the inverse logic ("IsFilteredBySimilarExchangeJobIds") in the filter model so that the default will be false and
        // thus avoids any potential issues with existing data cuts/scopes. [JP]
        IsFilteredBySimilarExchangeJobIds: !isExcludingIndirectJobMatches,
        SelectedExchangeScopeId: !!selectedExchangeScope ? selectedExchangeScope.Id : null
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

export const getAssociatedExchangeJobIds = createSelector(
  getAssociatedExchangeJobs,
  (exchangeJobs) => !!exchangeJobs && !!exchangeJobs.length ? exchangeJobs.map(ej => ej.ExchangeJobId) : []
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

