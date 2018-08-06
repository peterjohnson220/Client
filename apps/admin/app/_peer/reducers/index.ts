import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';
import * as fromGridReducer from 'libs/core/reducers/grid.reducer';
import { IFeatureGridState } from 'libs/core/reducers/grid.reducer';

// Import feature reducers
import * as fromExchangeReducer from './exchange.reducer';
import * as fromExchangeCompaniesReducer from './exchange-companies.reducer';
import * as fromImportExchangeJobsReducer from './import-exchange-jobs.reducer';
import * as fromAvailableCompaniesReducer from './available-companies.reducer';
import * as fromExchangeJobsReducer from './exchange-jobs.reducer';
import * as fromAvailableJobsReducer from './available-jobs.reducer';
import * as fromPendingExchangeAccessRequestsReducer from './pending-exchange-access-requests.reducer';
import * as fromPayfactorsCompanyExchangeInvitationsReducer from './payfactors-company-exchange-invitations.reducer';
import * as fromNewCompanyExchangeInvitationsReducer from './new-company-exchange-invitations.reducer';
import * as fromExchangeJobRequestsReducer from './exchange-job-requests.reducer';
import * as fromExchangeListReducer from './exchange-list.reducer';

// Feature area state
export interface PeerAdminState {
  exchange: fromExchangeReducer.State;
  exchangeCompanies: IFeatureGridState<fromExchangeCompaniesReducer.State>;
  importExchangeJobs: fromImportExchangeJobsReducer.State;
  availableCompanies: IFeatureGridState<fromAvailableCompaniesReducer.State>;
  availableJobs: IFeatureGridState<fromAvailableJobsReducer.State>;
  exchangeJobs: IFeatureGridState<fromExchangeJobsReducer.State>;
  pendingExchangeAccessRequests: IFeatureGridState<fromPendingExchangeAccessRequestsReducer.State>;
  payfactorsCompanyExchangeInvitations: IFeatureGridState<fromPayfactorsCompanyExchangeInvitationsReducer.State>;
  newCompanyExchangeInvitations: IFeatureGridState<fromNewCompanyExchangeInvitationsReducer.State>;
  exchangeJobRequests: IFeatureGridState<fromExchangeJobRequestsReducer.State>;
  exchangeList: fromExchangeListReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  peerAdmin: PeerAdminState;
}

// Feature area reducers
export const reducers = {
  exchange: fromExchangeReducer.reducer,
  exchangeCompanies: fromExchangeCompaniesReducer.reducer,
  importExchangeJobs: fromImportExchangeJobsReducer.reducer,
  availableCompanies: fromAvailableCompaniesReducer.reducer,
  exchangeJobs: fromExchangeJobsReducer.reducer,
  availableJobs: fromAvailableJobsReducer.reducer,
  pendingExchangeAccessRequests: fromPendingExchangeAccessRequestsReducer.reducer,
  payfactorsCompanyExchangeInvitations: fromPayfactorsCompanyExchangeInvitationsReducer.reducer,
  newCompanyExchangeInvitations: fromNewCompanyExchangeInvitationsReducer.reducer,
  exchangeJobRequests: fromExchangeJobRequestsReducer.reducer,
  exchangeList: fromExchangeListReducer.reducer
};

// Select Feature Area
export const selectPeerAdminState = createFeatureSelector<PeerAdminState>('peerAdmin');

// Feature Selectors
export const selectExchangeState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.exchange);
export const selectExchangeCompaniesState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.exchangeCompanies);
export const selectImportExchangeJobsState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.importExchangeJobs);
export const selectExchangeJobsState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.exchangeJobs);
export const selectAvailableCompaniesState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.availableCompanies);
export const selectAvailableJobsState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.availableJobs);
export const selectPendingExchangeAccessRequestsState =
  createSelector(selectPeerAdminState, (state: PeerAdminState) => state.pendingExchangeAccessRequests);
export const selectPayfactorsCompanyExchangeInvitationsState =
  createSelector(selectPeerAdminState, (state: PeerAdminState) => state.payfactorsCompanyExchangeInvitations);
export const selectNewCompanyExchangeInvitationsState =
  createSelector(selectPeerAdminState, (state: PeerAdminState) => state.newCompanyExchangeInvitations);
export const selectExchangeJobRequestsState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.exchangeJobRequests);
export const selectExchangeListState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.exchangeList);

// Manage Exchange Selectors
export const getManageExchange = createSelector(selectExchangeState, fromExchangeReducer.getExchange);

// Exchange List Selectors
export const getManageExchangeLoading = createSelector(
  selectExchangeState, fromExchangeReducer.getLoading
);
export const getManageExchangeLoadingError = createSelector(
  selectExchangeState, fromExchangeReducer.getLoadingError
);

// Import Exchange Job Selectors
export const getImportExchangeJobsModalOpen = createSelector(
  selectImportExchangeJobsState, fromImportExchangeJobsReducer.getImportExchangeJobsModalOpen
);
export const getImportExchangeJobsUploadingFile = createSelector(
  selectImportExchangeJobsState, fromImportExchangeJobsReducer.getUploadingFile
);
export const getImportExchangeJobsUploadingFileError = createSelector(
  selectImportExchangeJobsState, fromImportExchangeJobsReducer.getUploadingFileError
);
export const getStoredDataFile = createSelector(
  selectImportExchangeJobsState, fromImportExchangeJobsReducer.getStoredDataFile
);
export const getValidationResults = createSelector(
  selectImportExchangeJobsState, fromImportExchangeJobsReducer.getValidationResults
);
export const getImportingJobs = createSelector(
  selectImportExchangeJobsState, fromImportExchangeJobsReducer.getImportingJobs
);
export const getIsFileValid = createSelector(
  selectImportExchangeJobsState, fromImportExchangeJobsReducer.getIsFileValid
);

// Exchange Companies Selectors

export const selectExchangeCompaniesFeatureState = createSelector(
  selectExchangeCompaniesState,
  (state: IFeatureGridState<fromExchangeCompaniesReducer.State>) => state.feature
);
export const selectExchangeCompaniesGridState = createSelector(
  selectExchangeCompaniesState,
  (state: IFeatureGridState<fromExchangeCompaniesReducer.State>) => state.grid
);

export const {
  selectAll: getExchangeCompanies
} = fromExchangeCompaniesReducer.adapter.getSelectors(selectExchangeCompaniesFeatureState);

export const getExchangeCompaniesLoading = createSelector(
  selectExchangeCompaniesFeatureState, fromExchangeCompaniesReducer.getLoading
);

export const getExchangeCompaniesLoadingError = createSelector(
  selectExchangeCompaniesFeatureState, fromExchangeCompaniesReducer.getLoadingError
);

export const getAddExchangeCompaniesModalOpen = createSelector(
  selectExchangeCompaniesFeatureState, fromExchangeCompaniesReducer.getAddModalOpen
);

export const getExchangeCompaniesAdding = createSelector(
  selectExchangeCompaniesFeatureState, fromExchangeCompaniesReducer.getAdding
);

export const getExchangeCompaniesAddingError = createSelector(
  selectExchangeCompaniesFeatureState, fromExchangeCompaniesReducer.getAddingError
);

export const getTotalExchangeCompanies = createSelector(
  selectExchangeCompaniesFeatureState, fromExchangeCompaniesReducer.getTotal
);

export const getDeleteExchangeCompanyModalOpen = createSelector(
  selectExchangeCompaniesFeatureState, fromExchangeCompaniesReducer.getDeleteModalOpen
);

export const getExchangeCompanyDeleting = createSelector(
  selectExchangeCompaniesFeatureState, fromExchangeCompaniesReducer.getDeleting
);

export const getExchangeCompanyDeletingError = createSelector(
  selectExchangeCompaniesFeatureState, fromExchangeCompaniesReducer.getDeletingError
);

export const getExchangeCompaniesGridState = createSelector(
  selectExchangeCompaniesGridState, fromGridReducer.getGridState
);

export const getExchangeCompaniesGrid = createSelector(
  getExchangeCompanies,
  getTotalExchangeCompanies,
  (data, total) => {
    return {data: data, total: total};
  }
);

// Available Companies Selectors
export const selectAvailableCompaniesFeatureState = createSelector(
  selectAvailableCompaniesState,
  (state: IFeatureGridState<fromAvailableCompaniesReducer.State>) => state.feature
);

export const selectAvailableCompaniesGridState = createSelector(
  selectAvailableCompaniesState,
  (state: IFeatureGridState<fromAvailableCompaniesReducer.State>) => state.grid
);

export const {
  selectAll: getAvailableCompanies
} = fromAvailableCompaniesReducer.adapter.getSelectors(selectAvailableCompaniesFeatureState);

export const getAvailableCompaniesLoading = createSelector(
  selectAvailableCompaniesFeatureState,
  fromAvailableCompaniesReducer.getLoading
);

export const getAvailableCompaniesLoadingError = createSelector(
  selectAvailableCompaniesFeatureState,
  fromAvailableCompaniesReducer.getLoadingError
);

export const getTotalAvailableCompanies = createSelector(
  selectAvailableCompaniesFeatureState,
  fromAvailableCompaniesReducer.getTotal
);

export const getAvailableCompaniesGridState = createSelector(
  selectAvailableCompaniesGridState,
  fromGridReducer.getGridState
);

export const getAvailableCompaniesGridSelections = createSelector(
  selectAvailableCompaniesGridState,
  fromGridReducer.getGridSelections
);

export const getAvailableCompaniesGrid = createSelector(
  getAvailableCompanies,
  getTotalAvailableCompanies,
  (data, total) => {
    return {data: data, total: total};
  }
);

// Exchange Jobs Selectors
export const selectExchangeJobsFeatureState = createSelector(
  selectExchangeJobsState,
  (state: IFeatureGridState<fromExchangeJobsReducer.State>) => state.feature
);
export const selectExchangeJobsGridState = createSelector(
  selectExchangeJobsState,
  (state: IFeatureGridState<fromExchangeJobsReducer.State>) => state.grid
);

export const {
  selectAll: getExchangeJobs
} = fromExchangeJobsReducer.adapter.getSelectors(selectExchangeJobsFeatureState);

export const getExchangeJobsLoading = createSelector(
  selectExchangeJobsFeatureState, fromExchangeJobsReducer.getLoading
);

export const getExchangeJobsLoadingError = createSelector(
  selectExchangeJobsFeatureState, fromExchangeJobsReducer.getLoadingError
);

export const getAddExchangeJobsModalOpen = createSelector(
  selectExchangeJobsFeatureState, fromExchangeJobsReducer.getAddModalOpen
);

export const getExchangeJobsAdding = createSelector(
  selectExchangeJobsFeatureState, fromExchangeJobsReducer.getAdding
);

export const getExchangeJobsAddingError = createSelector(
  selectExchangeJobsFeatureState, fromExchangeJobsReducer.getAddingError
);

export const getTotalExchangeJobs = createSelector(
  selectExchangeJobsFeatureState, fromExchangeJobsReducer.getTotal
);

export const getExchangeJobsGridState = createSelector(
  selectExchangeJobsGridState, fromGridReducer.getGridState
);

export const getExchangeJobsGrid = createSelector(
  getExchangeJobs,
  getTotalExchangeJobs,
  (data, total) => {
    return {data: data, total: total};
  }
);


// Available Jobs Selectors
export const selectAvailableJobsFeatureState = createSelector(
  selectAvailableJobsState,
  (state: IFeatureGridState<fromAvailableJobsReducer.State>) => state.feature
);
export const selectAvailableJobsGridState = createSelector(
  selectAvailableJobsState,
  (state: IFeatureGridState<fromAvailableJobsReducer.State>) => state.grid
);

export const {
  selectAll: getAvailableJobs
} = fromAvailableJobsReducer.adapter.getSelectors(selectAvailableJobsFeatureState);

export const getAvailableJobsLoading = createSelector(
  selectAvailableJobsFeatureState,
  fromAvailableJobsReducer.getLoading
);

export const getAvailableJobsLoadingError = createSelector(
  selectAvailableJobsFeatureState,
  fromAvailableJobsReducer.getLoadingError
);

export const getTotalAvailableJobs = createSelector(selectAvailableJobsFeatureState, fromAvailableJobsReducer.getTotal);

export const getAvailableJobsGridState = createSelector(selectAvailableJobsGridState, fromGridReducer.getGridState);

export const getAvailableJobsGridSelections = createSelector(
  selectAvailableJobsGridState,
  fromGridReducer.getGridSelections
);

export const getAvailableJobsGrid = createSelector(
  getAvailableJobs,
  getTotalAvailableJobs,
  (data, total) => {
    return {data: data, total: total};
  }
);

// Pending Exchange Access Request Selectors
export const selectPendingExchangeAccessRequestsFeatureState = createSelector(
  selectPendingExchangeAccessRequestsState,
  (state: IFeatureGridState<fromPendingExchangeAccessRequestsReducer.State>) => state.feature
);

export const {
  selectAll: getPendingExchangeAccessRequests
} = fromPendingExchangeAccessRequestsReducer.adapter.getSelectors(selectPendingExchangeAccessRequestsFeatureState);

export const getPendingExchangeAccessRequestsLoading = createSelector(
  selectPendingExchangeAccessRequestsFeatureState, fromPendingExchangeAccessRequestsReducer.getLoading
);

export const getPendingExchangeAccessRequestsLoadingError = createSelector(
  selectPendingExchangeAccessRequestsFeatureState, fromPendingExchangeAccessRequestsReducer.getLoadingError
);

export const getTotalPendingExchangeAccessRequests = createSelector(
  selectPendingExchangeAccessRequestsFeatureState, fromPendingExchangeAccessRequestsReducer.getTotal
);

export const getPendingExchangeAccessRequestsGrid = createSelector(
  getPendingExchangeAccessRequests,
  getTotalPendingExchangeAccessRequests,
  (data, total) => {
    return {data: data, total: total};
  }
);

// Payfactors Company Exchange Invitation Selectors
export const selectPayfactorsCompanyExchangeInvitationsFeatureState = createSelector(
  selectPayfactorsCompanyExchangeInvitationsState,
  (state: IFeatureGridState<fromPayfactorsCompanyExchangeInvitationsReducer.State>) => state.feature
);

export const {
  selectAll: getPayfactorsCompanyExchangeInvitations
} = fromPayfactorsCompanyExchangeInvitationsReducer.adapter.getSelectors(selectPayfactorsCompanyExchangeInvitationsFeatureState);

export const getPayfactorsCompanyExchangeInvitationsLoading = createSelector(
  selectPayfactorsCompanyExchangeInvitationsFeatureState, fromPayfactorsCompanyExchangeInvitationsReducer.getLoading
);

export const getPayfactorsCompanyExchangeInvitationsLoadingError = createSelector(
  selectPayfactorsCompanyExchangeInvitationsFeatureState, fromPayfactorsCompanyExchangeInvitationsReducer.getLoadingError
);

export const getTotalPayfactorsCompanyExchangeInvitations = createSelector(
  selectPayfactorsCompanyExchangeInvitationsFeatureState, fromPayfactorsCompanyExchangeInvitationsReducer.getTotal
);

export const getPayfactorsCompanyExchangeInvitationsGrid = createSelector(
  getPayfactorsCompanyExchangeInvitations,
  getTotalPayfactorsCompanyExchangeInvitations,
  (data, total) => {
    return {data: data, total: total};
  }
);

// New Company Exchange Invitation Selectors
export const selectNewCompanyExchangeInvitationsFeatureState = createSelector(
  selectNewCompanyExchangeInvitationsState,
  (state: IFeatureGridState<fromNewCompanyExchangeInvitationsReducer.State>) => state.feature
);

export const {
  selectAll: getNewCompanyExchangeInvitations
} = fromNewCompanyExchangeInvitationsReducer.adapter.getSelectors(selectNewCompanyExchangeInvitationsFeatureState);

export const getNewCompanyExchangeInvitationsLoading = createSelector(
  selectNewCompanyExchangeInvitationsFeatureState, fromNewCompanyExchangeInvitationsReducer.getLoading
);

export const getNewCompanyExchangeInvitationsLoadingError = createSelector(
  selectNewCompanyExchangeInvitationsFeatureState, fromNewCompanyExchangeInvitationsReducer.getLoadingError
);

export const getTotalNewCompanyExchangeInvitations = createSelector(
  selectNewCompanyExchangeInvitationsFeatureState, fromNewCompanyExchangeInvitationsReducer.getTotal
);

export const getNewCompanyExchangeInvitationsGrid = createSelector(
  getNewCompanyExchangeInvitations,
  getTotalNewCompanyExchangeInvitations,
  (data, total) => {
    return {data: data, total: total};
  }
);

// Exchange Job Request Selectors
export const selectExchangeJobRequestsFeatureState = createSelector(
  selectExchangeJobRequestsState,
  (state: IFeatureGridState<fromExchangeJobRequestsReducer.State>) => state.feature
);

export const {
  selectAll: getExchangeJobRequests
} = fromExchangeJobRequestsReducer.adapter.getSelectors(selectExchangeJobRequestsFeatureState);

export const getExchangeJobRequestsLoading = createSelector(
  selectExchangeJobRequestsFeatureState, fromExchangeJobRequestsReducer.getLoading
);

export const getExchangeJobRequestsLoadingError = createSelector(
  selectExchangeJobRequestsFeatureState, fromExchangeJobRequestsReducer.getLoadingError
);

export const getTotalExchangeJobRequests = createSelector(
  selectExchangeJobRequestsFeatureState, fromExchangeJobRequestsReducer.getTotal
);

export const getExchangeJobRequestsGrid = createSelector(
  getExchangeJobRequests,
  getTotalExchangeJobRequests,
  (data, total) => {
    return {data: data, total: total};
  }
);

// Exchange List Selectors
export const {
  selectAll: getExchangeListItems,
} = fromExchangeListReducer.adapter.getSelectors(selectExchangeListState);

export const getExchangeListLoading = createSelector(
  selectExchangeListState, fromExchangeListReducer.getLoading
);

export const getExchangeListLoadingError = createSelector(
  selectExchangeListState, fromExchangeListReducer.getLoadingError
);

export const getExchangeListUpserting = createSelector(
  selectExchangeListState, fromExchangeListReducer.getUpserting
);

export const getExchangeListUpsertingError = createSelector(
  selectExchangeListState, fromExchangeListReducer.getUpsertingError
);

export const getExchangeListUpsertingErrorMessage = createSelector(
  selectExchangeListState, fromExchangeListReducer.getUpsertingErrorMessage
);

export const getExchangeListCreateExchangeModalOpen = createSelector(
  selectExchangeListState, fromExchangeListReducer.getCreateExchangeModalOpen
);

export const getExchangeListDeleting = createSelector(
  selectExchangeListState, fromExchangeListReducer.getDeleting
);

export const getExchangeListDeletingError = createSelector(
  selectExchangeListState, fromExchangeListReducer.getDeletingError
);

export const getExchangeListDeleteExchangeModalOpen = createSelector(
  selectExchangeListState, fromExchangeListReducer.getDeleteExchangeModalOpen
);
