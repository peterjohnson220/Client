import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromExchangeScopeReducer from './exchange-scope.reducer';
import * as fromExchangeFilterContextReducer from './exchange-filter-context.reducer';
import * as fromMapReducer from './map.reducer';
import * as fromExchangeExplorerContextInfoReducer from './exchange-explorer-context-info.reducer';
import * as fromExchangeDataCutReducer from './exchange-data-cut.reducer';

// Feature area state
export interface FeaturePeerExchangeExplorerState {
  map: fromMapReducer.State;
  exchangeScope: fromExchangeScopeReducer.State;
  exchangeFilterContext: fromExchangeFilterContextReducer.State;
  exchangeExplorerContextInfo: fromExchangeExplorerContextInfoReducer.State;
  exchangeDataCut: fromExchangeDataCutReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_peer_exchangeExplorer: FeaturePeerExchangeExplorerState;
}

// Feature area reducers
export const reducers = {
  map: fromMapReducer.reducer,
  exchangeScope: fromExchangeScopeReducer.reducer,
  exchangeFilterContext: fromExchangeFilterContextReducer.reducer,
  exchangeExplorerContextInfo: fromExchangeExplorerContextInfoReducer.reducer,
  exchangeDataCut: fromExchangeDataCutReducer.reducer
};

// Select Feature Area
export const selectFeaturePeerExchangeExplorerState = createFeatureSelector<FeaturePeerExchangeExplorerState>(
  'feature_peer_exchangeExplorer'
);

// Feature Selectors
export const selectMapState = createSelector(
  selectFeaturePeerExchangeExplorerState,
  (state: FeaturePeerExchangeExplorerState) => state.map
);

export const selectExchangeScopeState = createSelector(
  selectFeaturePeerExchangeExplorerState,
  (state: FeaturePeerExchangeExplorerState) => state.exchangeScope
);

export const selectFilterContextState = createSelector(
  selectFeaturePeerExchangeExplorerState,
  (state: FeaturePeerExchangeExplorerState) => state.exchangeFilterContext
);

export const selectExchangeExplorerContextInfo = createSelector(
  selectFeaturePeerExchangeExplorerState,
  (state: FeaturePeerExchangeExplorerState) => state.exchangeExplorerContextInfo
);

export const selectDataCutState = createSelector(
  selectFeaturePeerExchangeExplorerState,
  (state: FeaturePeerExchangeExplorerState) => state.exchangeDataCut
);

// Map Data Selectors
export const getPeerMapLoading = createSelector(selectMapState, fromMapReducer.getLoading);
export const getPeerMapLoadingError = createSelector(selectMapState, fromMapReducer.getLoadingError);
export const getPeerMapSummary = createSelector(selectMapState, fromMapReducer.getMapSummary);
export const getPeerMapCompaniesFromSummary = createSelector(
  getPeerMapSummary,
  (summary) => !!summary ? summary.OverallMapStats.Companies : []
);
export const getPeerMapUntaggedIncumbentCount = createSelector(
  getPeerMapSummary,
  (summary) => !!summary ? summary.OverallMapStats.UntaggedIncumbentCount : 0
);
export const getPeerMapExchangeJobIds = createSelector(
  getPeerMapSummary,
  (summary) => !!summary ? summary.OverallMapStats.ExchangeJobIds : []
);
export const getPeerMapOrgCount = createSelector(
  getPeerMapSummary,
  (summary) => !!summary ? summary.OverallMapStats.CompanyCount : 0
);
export const getPeerMapFilter = createSelector(selectMapState, fromMapReducer.getMapFilter);
export const getPeerMapCollection = createSelector(selectMapState, fromMapReducer.getMapCollection);
export const getPeerInitialMapBounds = createSelector(selectMapState, fromMapReducer.getInitialMapBounds);
export const getPeerMapMaxZoom = createSelector(selectMapState, fromMapReducer.getMaxZoom);
export const getPeerMapInitialZoomLevel = createSelector(selectMapState, fromMapReducer.getInitialZoomLevel);
export const getPeerMapCentroid = createSelector(selectMapState, fromMapReducer.getMapCentroid);
export const canLoadPeerMap = createSelector(selectMapState, fromMapReducer.canLoadMap);
export const peerMapShowNoData = createSelector(selectMapState, fromMapReducer.showNoData);
export const peerMapHasUntaggedIncumbents = createSelector(selectMapState, fromMapReducer.hasUntaggedIncumbents);
export const getPeerMapApplyingScope = createSelector(selectMapState, fromMapReducer.getApplyingScope);
export const getPeerMapAutoZooming = createSelector(selectMapState, fromMapReducer.getAutoZooming);
export const getPeerMapZoom = createSelector(selectMapState, fromMapReducer.getZoom);
export const getPeerMapInitialZoomComplete = createSelector(selectMapState, fromMapReducer.getInitialZoomComplete);
export const getPeerMapLoaded = createSelector(selectMapState, fromMapReducer.getMapLoaded);

// Exchange Scope Selectors
export const {
  selectAll: getExchangeScopesSrc
} = fromExchangeScopeReducer.adapter.getSelectors(selectExchangeScopeState);
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
export const getExchangeScopeUpserting = createSelector(selectExchangeScopeState, fromExchangeScopeReducer.getUpserting);
export const getExchangeScopeUpsertingError = createSelector(selectExchangeScopeState, fromExchangeScopeReducer.getUpsertingError);
export const getDeletingExchangeScope = createSelector(selectExchangeScopeState, fromExchangeScopeReducer.getDeletingScope);
export const getDeletingExchangeScopeError = createSelector(selectExchangeScopeState, fromExchangeScopeReducer.getDeletingScopeError);
export const getInDeleteExchangeScopeMode = createSelector(selectExchangeScopeState, fromExchangeScopeReducer.getInDeleteScopeMode);
export const getExchangeScopeToDelete = createSelector(selectExchangeScopeState, fromExchangeScopeReducer.getExchangeScopeToDelete);


// Exchange Explorer Info Selectors
export const getExchangeExplorerPayMarket = createSelector(
  selectExchangeExplorerContextInfo,
  fromExchangeExplorerContextInfoReducer.getPayMarket
);
export const getSearchFilterMappingDataObj = createSelector(
  selectExchangeExplorerContextInfo,
  fromExchangeExplorerContextInfoReducer.getSearchFilterMappingDataObj
);
export const getExchangeJobFilterOptions = createSelector(
  selectExchangeExplorerContextInfo,
  fromExchangeExplorerContextInfoReducer.getExchangeJobFilterOptions
);
export const getExchangeExplorerPayMarketGeoData = createSelector(
  selectExchangeExplorerContextInfo,
  fromExchangeExplorerContextInfoReducer.getPayMarketGeoData
);

// Exchange Filter Context Selectors
export const getFilterContextLimitToPayMarket = createSelector(
  selectFilterContextState,
  fromExchangeFilterContextReducer.getLimitToPayMarket
);
export const getFilterContextExcludeIndirectJobMatches = createSelector(
  selectFilterContextState,
  fromExchangeFilterContextReducer.getExcludeIndirectJobMatches
);
export const getFilterContextHasSimilarJobLevels = createSelector(
  selectFilterContextState,
  fromExchangeFilterContextReducer.getHasSimilarJobLevels
);
export const getFilterContextIncludeUntaggedIncumbents = createSelector(
  selectFilterContextState,
  fromExchangeFilterContextReducer.getIncludeUntaggedIncumbents
);
export const getFilterContextScopeGuid = createSelector(selectFilterContextState, fromExchangeFilterContextReducer.getScopeGuid);
export const getFilterContext = createSelector(selectFilterContextState, fromExchangeFilterContextReducer.getFilterContext);
export const getSelectedExchangeJobId = createSelector(
  getFilterContext,
  (filterContext) => {
    if (!filterContext) {
      return 0;
    }
    const exchangeJobId = !!filterContext.LockedExchangeJobId ? filterContext.LockedExchangeJobId : filterContext.ExchangeJobId;
    return !!exchangeJobId ? exchangeJobId : 0;
  }
);
export const getWeightingType = createSelector(selectFilterContextState, fromExchangeFilterContextReducer.getWeightingType);

// Exchange Data Cut Selectors
export const getDataCutLoading = createSelector(selectDataCutState, fromExchangeDataCutReducer.getLoading);

// MISC
export const getAssociatedExchangeJobIds = createSelector(
  getExchangeJobFilterOptions,
  (exchangeJobs) => !!exchangeJobs && !!exchangeJobs.length ? exchangeJobs.map(ej => ej.ExchangeJobId) : []
);
export const getHasAppliedFilterContext = createSelector(
  selectFilterContextState,
  fromExchangeFilterContextReducer.getHasAppliedContext
);

export const getExchangeScopes = createSelector(
  getExchangeScopesSrc,
  getExchangeJobFilterOptions,
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
export const getHasDefaultScope = createSelector(
  selectFilterContextState,
  fromExchangeFilterContextReducer.getHasDefaultScope
);
export const getFilterContextHasDefaultScope = createSelector(
  getHasDefaultScope,
  getFilterContext,
  getExchangeScopes,
  (hasDefaultScope, filterContext, scopes) => {
    if (!hasDefaultScope) {
      return false;
    }

    return !!filterContext && !!scopes && scopes.length && scopes.findIndex(s => s.Id === filterContext.ScopeGUID) > -1;
});

export const getFilterContextScopeSelection = createSelector(
  getExchangeScopes,
  getFilterContextScopeGuid,
  (scopes, selectedGuid) => {
    if (!scopes || !scopes.length || !selectedGuid) {
      return null;
    }
    return scopes.find(s => s.Id === selectedGuid);
  });
