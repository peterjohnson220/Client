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
import * as fromImportReducer from './import.reducer';
import * as fromCompanyJobsReducer from './company-jobs.reducer';

// Feature area state
export interface PeerManagementState {
  exchangeJobMapping: IFeatureGridState<fromExchangeJobMappingGridReducer.State>;
  exchangeJobMappingInfo: fromExchangeJobMappingInfoReducer.State;
  pfJobsExchangeRequest: fromPfJobsExchangeRequestReducer.State;
  jobFamilies: fromJobFamiliesReducer.State;
  import: fromImportReducer.State;
  companyJobs: IFeatureGridState<fromCompanyJobsReducer.State>;
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
  jobFamilies: fromJobFamiliesReducer.reducer,
  import: fromImportReducer.reducer,
  companyJobs: fromCompanyJobsReducer.reducer
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

export const selectImportState = createSelector(
  selectFeatureAreaState,
  (state: PeerManagementState) => state.import
);

export const selectCompanyJobsState = createSelector(
  selectFeatureAreaState,
  (state: PeerManagementState) => state.companyJobs);

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

export const getFirstCompanyJobMappingFromSelectedExchangeJob = createSelector(
  getSelectedExchangeJobMapping,
  (exchangeJobMapping) => {
    if (!exchangeJobMapping) {
      return null;
    }

    const firstCompanyJobMapping = exchangeJobMapping.CompanyJobMappings[0];
    return firstCompanyJobMapping ? firstCompanyJobMapping.CompanyJobId : null;
  }
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
export const getAssociatedCompanyJobs = createSelector(
  selectExchangeJobMappingInfoState,
  fromExchangeJobMappingInfoReducer.getAssociatedCompanyJobs
);

export const getCompanyJobsInfoLoading = createSelector(
  selectExchangeJobMappingInfoState,
  fromExchangeJobMappingInfoReducer.getLoading
);

export const getCompanyJobsInfoLoadingError = createSelector(
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

export const getExchangeJobsInfoAddingMapping = createSelector(
  selectExchangeJobMappingInfoState,
  fromExchangeJobMappingInfoReducer.getAddingMapping
);

export const getExchangeJobsInfoDeleteConfirmationModalOpen = createSelector(
  selectExchangeJobMappingInfoState,
  fromExchangeJobMappingInfoReducer.getDeleteConfirmationModalOpen
);

export const getExchangeJobsInfoDeletingMapping = createSelector(
  selectExchangeJobMappingInfoState,
  fromExchangeJobMappingInfoReducer.getDeletingMapping
);

export const getExchangeJobsInfoDeletingMappingError = createSelector(
  selectExchangeJobMappingInfoState,
  fromExchangeJobMappingInfoReducer.getDeletingError
);

export const getExchangeJobsInfoActiveCompanyJobId = createSelector(
  selectExchangeJobMappingInfoState,
  fromExchangeJobMappingInfoReducer.getActiveCompanyJobId
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

// import
export const getIsImportModalOpen = createSelector(
  selectImportState,
  fromImportReducer.getModalIsOpen
);

export const getImportStatus = createSelector(
  selectImportState,
  fromImportReducer.getImportStatus
);

// Company Jobs
export const getCompanyJobsGrid = createSelector(
  selectCompanyJobsState,
  (state: IFeatureGridState<fromCompanyJobsReducer.State>) => state.grid);

export const getCompanyJobsFeature = createSelector(
  selectCompanyJobsState,
  (state: IFeatureGridState<fromCompanyJobsReducer.State>) => state.feature);

export const getCompanyJobsGridState = createSelector(
  getCompanyJobsGrid,
  (fromGridReducer.getGridState)
);

export const {
  selectAll: getCompanyJobsList
} = fromCompanyJobsReducer.adapter.getSelectors(getCompanyJobsFeature);

export const getCompanyJobsTotal = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getTotal);

export const getCompanyJobsData = createSelector(
  getCompanyJobsList,
  getCompanyJobsTotal,
  (data, total) => ({ data, total})
);

export const getCompanyJobsLoading = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getLoading
);

export const getCompanyJobsLoadingError = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getLoadingError
);

export const getCompanyJobsLoadingErrorMessage = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getLoadingErrorMessage
);

export const getCompanyJobsSearchTerm = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getSearchTerm
);

export const getCompanyJobsSelectedCompanyJob = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getSelectedCompanyJob
);

export const getCompanyJobsPageRowIndexToScrollTo = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getPageRowIndexToScrollTo
);

export const getCompanyJobsMappedExchangeJobsLoading = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getMappedExchangeJobsLoading
);

export const getCompanyJobsMappedExchangeJobsLoadingSuccess = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getMappedExchangeJobsLoadingSuccess
);

export const getCompanyJobsMappedExchangeJobsLoadingError = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getMappedExchangeJobsLoadingError
);

export const getCompanyJobsMappedExchangeJob = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getMappedExchangeJob
);

export const getCompanyJobsJdmDescriptionIds = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getJdmDescriptionIds
);

export const getCompanyJobsDownloadingJdmDescription = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getDownloadingJdmDescription
);

export const getCompanyJobsDownloadingJdmDescriptionError = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getDownloadingJdmDescriptionError
);

export const getCompanyJobsExchangeId = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getCompanyJobsExchangeId
);

export const getCompanyJobsSearchingExchangeJobs = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getSearchingExchangeJobs
);

export const getCompanyJobsSearchingExchangeJobsSuccess = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getSearchingExchangeJobsSuccess
);

export const getCompanyJobsSearchingExchangeJobsError = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getSearchingExchangeJobsError
);

export const getCompanyJobsExchangeJobsSearchResults = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getExchangeJobsSearchResults
);

export const getCompanyJobsExchangeJobsTitleSearchTerm = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getExchangeJobsTitleSearchTerm
);

export const getCompanyJobsExchangeJobsDescriptionSearchTerm = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getExchangeJobsDescriptionSearchTerm
);

export const getCompanyJobsSavingAssociation = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getSavingAssociation
);

export const getCompanyJobsSavingAssociationSuccess = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getSavingAssociationSuccess
);

export const getCompanyJobsSavingAssociationError = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getSavingAssociationError
);

export const getCompanyJobsShowConfirmUnmatchModal = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getShowConfirmUnmatchModal
);

export const getCompanyJobsShowConfirmCreateProjectModal = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getShowConfirmCreateProjectModal
);

export const getCompanyJobsCreatingProject = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getCreatingProject
);

export const getCompanyJobsShowCreatingProjectError = createSelector(
  getCompanyJobsFeature,
  fromCompanyJobsReducer.getCreatingProjectError
);
