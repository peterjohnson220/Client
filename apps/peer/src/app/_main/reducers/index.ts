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
import * as fromExchangeAccessReducer from './exchange-access/exchange-access.reducer';
import * as fromAvailableExchangesReducer from './exchange-access/available-exchanges.reducer';
import * as fromPeerParticipantsReducer from './exchange-access/peer-participants.reducer';

// Feature area state
export interface PeerMainState {
  exchange: fromExchangeReducer.State;
  exchangeDashboard: fromExchangeDashboardReducer.State;
  exchangeJobMapping: IFeatureGridState<fromExchangeJobMappingGridReducer.State>;
  exchangeJobMappingInfo: fromExchangeJobMappingInfoReducer.State;
  exchangeAccess: fromExchangeAccessReducer.State;
  availableExchanges: fromAvailableExchangesReducer.State;
  peerParticipants: fromPeerParticipantsReducer.State;
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
  exchangeAccess: fromExchangeAccessReducer.reducer,
  availableExchanges: fromAvailableExchangesReducer.reducer,
  peerParticipants: fromPeerParticipantsReducer.reducer
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

// Exchange Access Selectors
export const selectExchangeAccessState = createSelector(
  selectFeatureAreaState,
  (state: PeerMainState) => state.exchangeAccess
);

export const selectAvailableExchangesState = createSelector(
  selectFeatureAreaState,
  (state: PeerMainState) => state.availableExchanges
);

export const selectPeerParticipantsState = createSelector(
  selectFeatureAreaState,
  (state: PeerMainState) => state.peerParticipants
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

export const getExchangeJobMappingsQuery = createSelector(
  selectExchangeJobMappingsFeatureState,
  fromExchangeJobMappingGridReducer.getQuery
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

export const getExchangeJobMappingGridStateAndQuery = createSelector(
  getExchangeJobMappingsGridState,
  getExchangeJobMappingsQuery,
  (gridState, query)  => {
    return { gridState, query };
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

// Exchange Access
export const getExchangeAccessModalOpen = createSelector(
  selectExchangeAccessState,
  fromExchangeAccessReducer.getModalOpen
);

export const getExchangeAccessRequesting = createSelector(
  selectExchangeAccessState,
  fromExchangeAccessReducer.getRequesting
);

export const getExchangeAccessRequestingError = createSelector(
  selectExchangeAccessState,
  fromExchangeAccessReducer.getRequestingError
);

export const getAvailableExchangesQueryPayload = createSelector(
  selectExchangeAccessState,
  fromExchangeAccessReducer.getAvailableExchangesQueryPayload
);

// Exchange Access - Available Exchanges
export const {
  selectAll: getAvailableExchanges
} = fromAvailableExchangesReducer.adapter.getSelectors(selectAvailableExchangesState);

export const getAvailableExchangesLoading = createSelector(
  selectAvailableExchangesState,
  fromAvailableExchangesReducer.getLoading
);

export const getAvailableExchangesLoadingError = createSelector(
  selectAvailableExchangesState,
  fromAvailableExchangesReducer.getLoadingError
);

// Exchange Access - Peer Participants
export const {
  selectAll: getPeerParticipants
} = fromPeerParticipantsReducer.adapter.getSelectors(selectPeerParticipantsState);

export const getPeerParticipantsLoading = createSelector(
  selectPeerParticipantsState,
  fromPeerParticipantsReducer.getLoading
);

export const getPeerParticipantsLoadingError = createSelector(
  selectPeerParticipantsState,
  fromPeerParticipantsReducer.getLoadingError
);
