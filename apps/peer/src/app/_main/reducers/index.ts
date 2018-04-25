import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromExchangeDashboardReducer from './exchange-dashboard.reducer';
import * as fromGridReducer from 'libs/core/reducers/grid.reducer';
import * as fromExchangeReducer from 'libs/features/peer/reducers/exchange.reducer';
import { IFeatureGridState } from 'libs/core/reducers/grid.reducer';

import * as fromExchangeJobMappingGridReducer from './exchange-job-mapping-grid.reducer';
import * as fromExchangeJobMappingInfoReducer from './exchange-job-mapping-info.reducer';
import * as fromPeerParticipantsReducer from './peer-participants.reducer';
import * as fromPfCompaniesExchangeRequestReducer from './exchange-request/pf-companies.reducer';
import * as fromAccessExchangeRequestReducer from './exchange-request/access-exchange-request.reducer';
import * as fromPfJobsExchangeRequestReducer from './exchange-request/pf-jobs.reducer';
import * as fromExchangeRequestReducer from './exchange-request.reducer';
import * as fromExchangeJobComparisonGridReducer from './exchange-job-comparison-grid.reducer';

// Feature area state
export interface PeerMainState {
  exchange: fromExchangeReducer.State;
  exchangeDashboard: fromExchangeDashboardReducer.State;
  exchangeJobMapping: IFeatureGridState<fromExchangeJobMappingGridReducer.State>;
  exchangeJobMappingInfo: fromExchangeJobMappingInfoReducer.State;
  peerParticipants: fromPeerParticipantsReducer.State;
  accessExchangeRequest: fromAccessExchangeRequestReducer.State;
  pfCompaniesExchangeRequest: fromPfCompaniesExchangeRequestReducer.State;
  pfJobsExchangeRequest: fromPfJobsExchangeRequestReducer.State;
  exchangeJobComparison: IFeatureGridState<fromExchangeJobComparisonGridReducer.State>;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  peerMain: PeerMainState;
}

// Feature area reducers
export const reducers = {
  exchange: fromExchangeReducer.reducer,
  exchangeDashboard: fromExchangeDashboardReducer.reducer,
  exchangeJobMapping: fromExchangeJobMappingGridReducer.reducer,
  exchangeJobMappingInfo: fromExchangeJobMappingInfoReducer.reducer,
  peerParticipants: fromPeerParticipantsReducer.reducer,
  accessExchangeRequest: fromAccessExchangeRequestReducer.reducer,
  pfCompaniesExchangeRequest: fromPfCompaniesExchangeRequestReducer.reducer,
  pfJobsExchangeRequest: fromPfJobsExchangeRequestReducer.reducer,
  exchangeJobComparison: fromExchangeJobComparisonGridReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<PeerMainState>('peerMain');

// Feature Selectors
export const selectExchangeState = createSelector(
  selectFeatureAreaState,
  (state: PeerMainState) => state.exchange
);

export const selectExchangeDashboardState = createSelector(
  selectFeatureAreaState,
  (state: PeerMainState) => state.exchangeDashboard
);

export const selectExchangeJobMappingState = createSelector(
  selectFeatureAreaState,
  (state: PeerMainState) => state.exchangeJobMapping
);

export const selectExchangeJobMappingInfoState = createSelector(
  selectFeatureAreaState,
  (state: PeerMainState) => state.exchangeJobMappingInfo
);

export const selectExchangeJobComparisonState = createSelector(
  selectFeatureAreaState,
  (state: PeerMainState) => state.exchangeJobComparison
);

// Exchange Request Selectors
export const selectPeerParticipantsState = createSelector(
  selectFeatureAreaState,
  (state: PeerMainState) => state.peerParticipants
);

export const selectAccessExchangeRequestState = createSelector(
  selectFeatureAreaState,
  (state: PeerMainState) => state.accessExchangeRequest
);

export const selectPfCompaniesExchangeRequestState = createSelector(
  selectFeatureAreaState,
  (state: PeerMainState) => state.pfCompaniesExchangeRequest
);

export const selectPfJobsExchangeRequestState = createSelector(
  selectFeatureAreaState,
  (state: PeerMainState) => state.pfJobsExchangeRequest
);

// Exchange Selectors
export const getExchange = createSelector(
  selectExchangeState,
  fromExchangeReducer.getExchange
);
export const getExchangeLoading = createSelector(
  selectExchangeState,
  fromExchangeReducer.getLoading
);
export const getExchangeLoadingError = createSelector(
  selectExchangeState,
  fromExchangeReducer.getLoadingError
);

// Exchange Dashboard Selectors
export const getExchangeDashboardCompanyChartItems = createSelector(
  selectExchangeDashboardState,
  fromExchangeDashboardReducer.getCompanyChartItems
);
export const getExchangeDashboardLoadingCompanyChart = createSelector(
  selectExchangeDashboardState,
  fromExchangeDashboardReducer.getLoadingCompanyChart
);
export const getExchangeDashboardLoadingCompanyChartError = createSelector(
  selectExchangeDashboardState,
  fromExchangeDashboardReducer.getLoadingCompanyChartError
);
export const getExchangeDashboardJobChartItems = createSelector(
  selectExchangeDashboardState,
  fromExchangeDashboardReducer.getJobChartItems
);
export const getExchangeDashboardLoadingJobChart = createSelector(
  selectExchangeDashboardState,
  fromExchangeDashboardReducer.getLoadingJobChart
);
export const getExchangeDashboardLoadingJobChartError = createSelector(
  selectExchangeDashboardState,
  fromExchangeDashboardReducer.getLoadingJobChartError
);
export const getExchangeDashboardIndustryChartItems = createSelector(
  selectExchangeDashboardState,
  fromExchangeDashboardReducer.getIndustryChartItems
);
export const getExchangeDashboardLoadingIndustryChart = createSelector(
  selectExchangeDashboardState,
  fromExchangeDashboardReducer.getLoadingIndustryChart
);
export const getExchangeDashboardLoadingIndustryChartError = createSelector(
  selectExchangeDashboardState,
  fromExchangeDashboardReducer.getLoadingIndustryChartError
);
export const getExchangeDashboardJobFamilyChartItems = createSelector(
  selectExchangeDashboardState,
  fromExchangeDashboardReducer.getJobFamilyChartItems
);
export const getExchangeDashboardLoadingJobFamilyChart = createSelector(
  selectExchangeDashboardState,
  fromExchangeDashboardReducer.getLoadingJobFamilyChart
);
export const getExchangeDashboardLoadingJobFamilyChartError = createSelector(
  selectExchangeDashboardState,
  fromExchangeDashboardReducer.getLoadingJobFamilyChartError
);
export const getExchangeDashboardRevenueChartItems = createSelector(
  selectExchangeDashboardState,
  fromExchangeDashboardReducer.getRevenueChartItems
);
export const getExchangeDashboardLoadingRevenueChart = createSelector(
  selectExchangeDashboardState,
  fromExchangeDashboardReducer.getLoadingRevenueChart
);
export const getExchangeDashboardLoadingRevenueChartError = createSelector(
  selectExchangeDashboardState,
  fromExchangeDashboardReducer.getLoadingRevenueChartError
);
export const getExchangeDashboardDetailChartType = createSelector(
  selectExchangeDashboardState,
  fromExchangeDashboardReducer.getDetailChartType
);
export const getExchangeDashboardDetailChartCategory = createSelector(
  selectExchangeDashboardState,
  fromExchangeDashboardReducer.getDetailChartCategory
);
export const getExchangeDashboardDetailChartItems = createSelector(
  selectExchangeDashboardState,
  fromExchangeDashboardReducer.getDetailChartItems
);
export const getExchangeDashboardLoadingDetailChart = createSelector(
  selectExchangeDashboardState,
  fromExchangeDashboardReducer.getLoadingDetailChart
);
export const getExchangeDashboardLoadingDetailChartError = createSelector(
  selectExchangeDashboardState,
  fromExchangeDashboardReducer.getLoadingDetailChartError
);
export const getExchangeDashboardSidebarVisible = createSelector(
  selectExchangeDashboardState,
  fromExchangeDashboardReducer.getSidebarVisible
);

// Exchange Job Mapping Selectors
export const selectExchangeJobMappingsFeatureState = createSelector(
  selectExchangeJobMappingState,
  (state: IFeatureGridState<fromExchangeJobMappingGridReducer.State>) => state.feature
);

export const selectExchangeJobMappingsGridState = createSelector(
  selectExchangeJobMappingState,
  (state: IFeatureGridState<fromExchangeJobMappingGridReducer.State>) => state.grid
);

export const {
  selectAll: getExchangeJobMappings
} = fromExchangeJobMappingGridReducer.adapter.getSelectors(selectExchangeJobMappingsFeatureState);

export const getExchangeJobMappingsLoading = createSelector(
  selectExchangeJobMappingsFeatureState,
  fromExchangeJobMappingGridReducer.getLoading
);

export const getExchangeJobMappingsLoadingError = createSelector(
  selectExchangeJobMappingsFeatureState,
  fromExchangeJobMappingGridReducer.getLoadingError
);

export const getExchangeJobMappingsTotal = createSelector(
  selectExchangeJobMappingsFeatureState,
  fromExchangeJobMappingGridReducer.getTotal
);

export const getExchangeJobMappingsGridState = createSelector(
  selectExchangeJobMappingsGridState,
  fromGridReducer.getGridState
);

export const getSelectedExchangeJobMapping = createSelector(
  selectExchangeJobMappingsFeatureState,
  fromExchangeJobMappingGridReducer.getSelectedMapping
);

export const getExchangeJobMappingPageRowIndexToScrollTo = createSelector(
  selectExchangeJobMappingsFeatureState,
  fromExchangeJobMappingGridReducer.getPageRowIndexToScrollTo
);

export const getExchangeJobMappingsGridData = createSelector(
  getExchangeJobMappings,
  getExchangeJobMappingsTotal,
  (data, total) => {
    return { data: data, total: total };
  }
);

export const getLoadExchangeJobMappingGridRequest = createSelector(
  getExchange,
  getExchangeJobMappingsGridState,
  (exchange, gridState) => {
    return {exchangeId: exchange ? exchange.ExchangeId : 0, listState: gridState};
  }
);

// Exchange Job Mapping Info Selectors
export const getCompanyJobsToMapToLoading = createSelector(
  selectExchangeJobMappingInfoState,
  fromExchangeJobMappingInfoReducer.getLoading
);

export const getCompanyJobsToMapToLoadingError = createSelector(
  selectExchangeJobMappingInfoState,
  fromExchangeJobMappingInfoReducer.getLoadingError
);

export const getExchangeJobsInfoApplyingMapping = createSelector(
  selectExchangeJobMappingInfoState,
  fromExchangeJobMappingInfoReducer.getApplyingMapping
);

export const getExchangeJobsInfoApplyingMappingError = createSelector(
  selectExchangeJobMappingInfoState,
  fromExchangeJobMappingInfoReducer.getApplyingMappingError
);

export const getExchangeJobsInfoSelectedMappingCompanyJobId = createSelector(
  selectExchangeJobMappingInfoState,
  fromExchangeJobMappingInfoReducer.getSelectedMappingCompanyJobId
);

export const getExchangeJobsInfoEditingMapping = createSelector(
  selectExchangeJobMappingInfoState,
  fromExchangeJobMappingInfoReducer.getEditingMapping
);

export const {
  selectAll: getCompanyJobsToMapTo
} = fromExchangeJobMappingInfoReducer.adapter.getSelectors(selectExchangeJobMappingInfoState);

// Exchange Request - Access
export const {
  selectAll: getAccessExchangeRequestCandidates
} = fromAccessExchangeRequestReducer.adapter.getSelectors(selectAccessExchangeRequestState);
export const getAccessExchangeRequestCandidatesLoading = createSelector(
  selectAccessExchangeRequestState,
  fromExchangeRequestReducer.getLoading
);
export const getAccessExchangeRequestCandidatesLoadingError = createSelector(
  selectAccessExchangeRequestState,
  fromExchangeRequestReducer.getLoadingError
);
export const getAccessExchangeRequestModalOpen = createSelector(
  selectAccessExchangeRequestState,
  fromExchangeRequestReducer.getModalOpen
);
export const getAccessExchangeRequestRequesting = createSelector(
  selectAccessExchangeRequestState,
  fromExchangeRequestReducer.getRequesting
);
export const getAccessExchangeRequestContext = createSelector(
  selectAccessExchangeRequestState,
  fromAccessExchangeRequestReducer.getLoadingRequestContext
);

// Exchange Request - Access - Peer Participants
export const {
  selectAll: getPeerParticipants
} = fromPeerParticipantsReducer.adapter.getSelectors(selectPeerParticipantsState);

export const getPeerParticipantsLoading = createSelector(
  selectPeerParticipantsState,
  fromPeerParticipantsReducer.getLoading
);

// Exchange Request - pfCompanies
export const {
  selectAll: getPfCompaniesExchangeRequestCandidates
} = fromPfCompaniesExchangeRequestReducer.adapter.getSelectors(selectPfCompaniesExchangeRequestState);
export const getPfCompaniesExchangeRequestCandidatesLoading = createSelector(
  selectPfCompaniesExchangeRequestState,
  fromExchangeRequestReducer.getLoading
);
export const getPfCompaniesExchangeRequestCandidatesLoadingError = createSelector(
  selectPfCompaniesExchangeRequestState,
  fromExchangeRequestReducer.getLoadingError
);
export const getPfCompaniesExchangeRequestModalOpen = createSelector(
  selectPfCompaniesExchangeRequestState,
  fromExchangeRequestReducer.getModalOpen
);
export const getPfCompaniesExchangeRequestRequesting = createSelector(
  selectPfCompaniesExchangeRequestState,
  fromExchangeRequestReducer.getRequesting
);
export const getPfCompaniesExchangeRequestContext = createSelector(
  selectPfCompaniesExchangeRequestState,
  selectExchangeState,
  (exchangeRequestState, exchangeState) => {
    return {
      Query: exchangeRequestState.searchTerm,
      ExchangeId: exchangeState.exchange ? exchangeState.exchange.ExchangeId : 0
    };
  }
);

// Exchange Request - pfJobs
export const {
  selectAll: getPfJobsExchangeRequestCandidates
} = fromPfJobsExchangeRequestReducer.adapter.getSelectors(selectPfJobsExchangeRequestState);
export const getPfJobsExchangeRequestCandidatesLoading = createSelector(
  selectPfJobsExchangeRequestState,
  fromExchangeRequestReducer.getLoading
);
export const getPfJobsExchangeRequestCandidatesLoadingError = createSelector(
  selectPfJobsExchangeRequestState,
  fromExchangeRequestReducer.getLoadingError
);
export const getPfJobsExchangeRequestModalOpen = createSelector(
  selectPfJobsExchangeRequestState,
  fromExchangeRequestReducer.getModalOpen
);
export const getPfJobsExchangeRequestRequesting = createSelector(
  selectPfJobsExchangeRequestState,
  fromExchangeRequestReducer.getRequesting
);
export const getPfJobsExchangeRequestContext = createSelector(
  selectPfJobsExchangeRequestState,
  selectExchangeState,
  (exchangeRequestState, exchangeState) => {
    return {
      Query: exchangeRequestState.searchTerm,
      ExchangeId: exchangeState.exchange ? exchangeState.exchange.ExchangeId : 0,
      JobDescriptionQuery: exchangeRequestState.filterOptions ? exchangeRequestState.filterOptions.JobDescriptionQuery : ''
    };
  }
);

// Exchange Job Comparison Selectors
export const selectExchangeJobComparisonFeatureState = createSelector(
  selectExchangeJobComparisonState,
  (state: IFeatureGridState<fromExchangeJobComparisonGridReducer.State>) => state.feature
);

export const selectExchangeJobComparisonGridState = createSelector(
  selectExchangeJobComparisonState,
  (state: IFeatureGridState<fromExchangeJobComparisonGridReducer.State>) => state.grid
);

export const {
  selectAll: getExchangeJobComparisons
} = fromExchangeJobComparisonGridReducer.adapter.getSelectors(selectExchangeJobComparisonFeatureState);

export const getExchangeJobComparisonsLoading = createSelector(
  selectExchangeJobComparisonFeatureState,
  fromExchangeJobComparisonGridReducer.getLoading
);

export const getExchangeJobComparisonsLoadingError = createSelector(
  selectExchangeJobComparisonFeatureState,
  fromExchangeJobComparisonGridReducer.getLoadingError
);

export const getExchangeJobComparisonsTotal = createSelector(
  selectExchangeJobComparisonFeatureState,
  fromExchangeJobComparisonGridReducer.getTotal
);

export const getExchangeJobComparisonsGridState = createSelector(
  selectExchangeJobComparisonGridState,
  fromGridReducer.getGridState
);

export const getExchangeJobComparisonsGridData = createSelector(
  getExchangeJobComparisons,
  getExchangeJobComparisonsTotal,
  (data, total) => {
    return { data: data, total: total };
  }
);

export const getLoadExchangeJobComparisonGridRequest = createSelector(
  getExchange,
  getExchangeJobComparisonsGridState,
  (exchange, gridState) => {
    return {exchangeId: exchange ? exchange.ExchangeId : 0, listState: gridState};
  }
);
