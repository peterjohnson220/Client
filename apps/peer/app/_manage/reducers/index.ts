import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromGridReducer from 'libs/core/reducers/grid.reducer';
import { IFeatureGridState } from 'libs/core/reducers/grid.reducer';

import * as fromExchangeJobMappingGridReducer from './exchange-job-mapping-grid.reducer';
import * as fromExchangeJobMappingInfoReducer from './exchange-job-mapping-info.reducer';
import * as fromPfJobsExchangeRequestReducer from './pf-jobs.reducer';
import * as fromSharedPeerReducer from '../../shared/reducers';
import * as fromExchangeRequestReducer from '../../shared/reducers/exchange-request.reducer';
import * as fromJobFamiliesReducer from './job-families.reducer';

// Feature area state
export interface PeerManagementState {
  exchangeJobMapping: IFeatureGridState<fromExchangeJobMappingGridReducer.State>;
  exchangeJobMappingInfo: fromExchangeJobMappingInfoReducer.State;
  pfJobsExchangeRequest: fromPfJobsExchangeRequestReducer.State;
  jobFamilies: fromJobFamiliesReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  peer_manage: PeerManagementState;
}

// Feature area reducers
export const reducers = {
  exchangeJobMapping: fromExchangeJobMappingGridReducer.reducer,
  exchangeJobMappingInfo: fromExchangeJobMappingInfoReducer.reducer,
  pfJobsExchangeRequest: fromPfJobsExchangeRequestReducer.reducer,
  jobFamilies: fromJobFamiliesReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<PeerManagementState>('peer_manage');

// Feature Selectors
export const selectExchangeJobMappingState = createSelector(
  selectFeatureAreaState,
  (state: PeerManagementState) => state.exchangeJobMapping
);

export const selectExchangeJobMappingInfoState = createSelector(
  selectFeatureAreaState,
  (state: PeerManagementState) => state.exchangeJobMappingInfo
);

export const selectPfJobsExchangeRequestState = createSelector(
  selectFeatureAreaState,
  (state: PeerManagementState) => state.pfJobsExchangeRequest
);

export const selectJobFamiliesState = createSelector(
  selectFeatureAreaState,
  (state: PeerManagementState) => state.jobFamilies
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
  fromSharedPeerReducer.getExchange,
  getExchangeJobMappingsGridState,
  (exchange, gridState) => {
    return { exchangeId: exchange ? exchange.ExchangeId : 0, listState: gridState };
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
  fromSharedPeerReducer.getExchange,
  (exchangeRequestState, exchange) => {
    return {
      Query: exchangeRequestState.searchTerm,
      ExchangeId: exchange ? exchange.ExchangeId : 0,
      JobDescriptionQuery: exchangeRequestState.filterOptions ? exchangeRequestState.filterOptions.JobDescriptionQuery : ''
    };
  }
);

// Job Families
export const {
  selectAll: getJobFamilies
} = fromJobFamiliesReducer.adapter.getSelectors(selectJobFamiliesState);
export const getJobFamiliesLoading = createSelector(
  selectJobFamiliesState,
  fromJobFamiliesReducer.getLoading
);
export const getJobFamiliesLoadingError = createSelector(
  selectJobFamiliesState,
  fromJobFamiliesReducer.getLoadingError
);
