import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';
import { IFeatureGridState } from 'libs/core/reducers/grid.reducer';
import * as fromGridReducer from 'libs/core/reducers/grid.reducer';

// Import feature reducers
import * as fromExchangeDashboardReducer from './exchange-dashboard.reducer';
import * as fromPeerParticipantsReducer from './peer-participants.reducer';
import * as fromPfCompaniesExchangeRequestReducer from './pf-companies.reducer';
import * as fromAccessExchangeRequestReducer from './access-exchange-request.reducer';
import * as fromExchangeRequestReducer from '../../shared/reducers/exchange-request.reducer';
import * as fromSharedPeerReducer from '../../shared/reducers';
import * as fromExchangeJobComparisonGridReducer from './exchange-job-comparison-grid.reducer';

// Feature area state
export interface DashboardState {
  exchangeDashboard: fromExchangeDashboardReducer.State;
  peerParticipants: fromPeerParticipantsReducer.State;
  accessExchangeRequest: fromAccessExchangeRequestReducer.State;
  pfCompaniesExchangeRequest: fromPfCompaniesExchangeRequestReducer.State;
  exchangeJobComparison: IFeatureGridState<fromExchangeJobComparisonGridReducer.State>;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  peerDashboard: DashboardState;
}

// Feature area reducers
export const reducers = {
  exchangeDashboard: fromExchangeDashboardReducer.reducer,
  peerParticipants: fromPeerParticipantsReducer.reducer,
  accessExchangeRequest: fromAccessExchangeRequestReducer.reducer,
  pfCompaniesExchangeRequest: fromPfCompaniesExchangeRequestReducer.reducer,
  exchangeJobComparison: fromExchangeJobComparisonGridReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<DashboardState>('peer_dashboard');

// Feature Selectors
export const selectExchangeDashboardState = createSelector(
  selectFeatureAreaState,
  (state: DashboardState) => state.exchangeDashboard
);



export const selectExchangeJobComparisonState = createSelector(
  selectFeatureAreaState,
  (state: DashboardState) => state.exchangeJobComparison
);

export const selectPeerParticipantsState = createSelector(
  selectFeatureAreaState,
  (state: DashboardState) => state.peerParticipants
);

export const selectAccessExchangeRequestState = createSelector(
  selectFeatureAreaState,
  (state: DashboardState) => state.accessExchangeRequest
);

export const selectPfCompaniesExchangeRequestState = createSelector(
  selectFeatureAreaState,
  (state: DashboardState) => state.pfCompaniesExchangeRequest
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
  fromSharedPeerReducer.getExchange,
  (exchangeRequestState, exchange) => {
    return {
      Query: exchangeRequestState.searchTerm,
      ExchangeId: exchange ? exchange.ExchangeId : 0
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
