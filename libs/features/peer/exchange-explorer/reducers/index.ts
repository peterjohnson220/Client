import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromExchangeScopeReducer from './exchange-scope.reducer';
import * as fromExchangeFilterContextReducer from './exchange-filter-context.reducer';
import * as fromMapReducer from './map.reducer';
import {
  getExchangeDataCutRequestData,
  getPeerFilterPayMarket, getPeerFilterScopeSelection,
  getPeerFilterSelections, getSystemFilter,
  LibsPeerMapState,
  selectLibsPeerMapState
} from '../../map/reducers';
import {ExchangeStatCompanyMakeup} from '../../../../models/peer';

// Feature area state
export interface FeaturePeerExchangeExplorerState {
  map: fromMapReducer.State;
  exchangeScope: fromExchangeScopeReducer.State;
  exchangeFilterContext: fromExchangeFilterContextReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_peer_exchangeExplorer: FeaturePeerExchangeExplorerState;
}

// Feature area reducers
export const reducers = {
  map: fromMapReducer.reducer,
  exchangeScope: fromExchangeScopeReducer.reducer,
  exchangeFilterContext: fromExchangeFilterContextReducer.reducer
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

// Exchange Scope Selectors
export const {
  selectAll: getExchangeScopes
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
export const getDeletingExchangeScope = createSelector(selectExchangeScopeState, fromExchangeScopeReducer.getDeletingScope);
export const getDeletingExchangeScopeError = createSelector(selectExchangeScopeState, fromExchangeScopeReducer.getDeletingScopeError);
export const getInDeleteExchangeScopeMode = createSelector(selectExchangeScopeState, fromExchangeScopeReducer.getInDeleteScopeMode);
export const getExchangeScopeToDelete = createSelector(selectExchangeScopeState, fromExchangeScopeReducer.getExchangeScopeToDelete);


// Exchange Filter Context Selectors
export const getFilterContextPayMarket = createSelector(selectFilterContextState, fromExchangeFilterContextReducer.getPayMarket);
export const getFilterContextSystemFilter = createSelector(selectFilterContextState, fromExchangeFilterContextReducer.getSystemFilter);
export const getFilterContextCountUntaggedIncumbents = createSelector(
  selectFilterContextState,
  fromExchangeFilterContextReducer.getCountUntaggedIncumbents
);
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
export const getFilterContextScopeSelection = createSelector(selectFilterContextState, fromExchangeFilterContextReducer.getScopeSelection);

export const getFilterContext = createSelector(selectFilterContextState, fromExchangeFilterContextReducer.getFilterContext);


// MISC

export const getFilterRequest = createSelector(
  getFilterContext,
  getPeerMapFilter,
  (filterContext, mapFilter) => {
    return {
      filterContext,
      mapFilter
    };
  }
);

// TODO: This needs to live somewhere else with access to the searchReducer
// export const getUpsertDataCutRequestData = createSelector(
//   getExchangeDataCutRequestData,
//   getPeerFilterPayMarket,
//   (filterDetails, paymarketDetails) => {
//     return {
//       FilterDetails: filterDetails,
//       PayMarketDetails: {
//         CompanyPayMarketId: paymarketDetails ? paymarketDetails.CompanyPayMarketId : null,
//         PayMarketName: paymarketDetails ? paymarketDetails.PayMarket : null
//       }
//     };
//   }
// );

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

