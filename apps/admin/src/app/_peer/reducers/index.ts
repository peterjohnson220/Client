import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromManageExchangeReducer from './manage-exchange.reducer';
import * as fromExchangeCompaniesReducer from './exchange-companies.reducer';
import * as fromImportExchangeJobsReducer from './import-exchange-jobs.reducer';
import * as fromAvailableCompaniesReducer from './available-companies.reducer';
import * as fromAvailableJobsReducer from './available-jobs.reducer';

// Feature area state
export interface PeerAdminState {
  manageExchange: fromManageExchangeReducer.State;
  exchangeCompanies: fromExchangeCompaniesReducer.State;
  importExchangeJobs: fromImportExchangeJobsReducer.State;
  availableCompanies: fromAvailableCompaniesReducer.State;
  availableJobs: fromAvailableJobsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  peerAdmin: PeerAdminState;
}

// Feature area reducers
export const reducers = {
  manageExchange: fromManageExchangeReducer.reducer,
  exchangeCompanies: fromExchangeCompaniesReducer.reducer,
  importExchangeJobs: fromImportExchangeJobsReducer.reducer,
  availableCompanies: fromAvailableCompaniesReducer.reducer,
  availableJobs: fromAvailableJobsReducer.reducer
};

// Select Feature Area
export const selectPeerAdminState = createFeatureSelector<PeerAdminState>('peerAdmin');

// Feature Selectors
export const selectManageExchangeState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.manageExchange);
export const selectExchangeCompaniesState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.exchangeCompanies);
export const selectImportExchangeJobsState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.importExchangeJobs);
export const selectAvailableCompaniesState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.availableCompanies);
export const selectAvailableJobsState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.availableJobs);

// Manage Exchange Selectors
export const getManageExchange = createSelector(selectManageExchangeState, fromManageExchangeReducer.getExchange);

// Exchange List Selectors
export const getManageExchangeLoading = createSelector(
  selectManageExchangeState, fromManageExchangeReducer.getLoading
);
export const getManageExchangeLoadingError = createSelector(
  selectManageExchangeState, fromManageExchangeReducer.getLoadingError
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
export const {
  selectAll: getExchangeCompanies
} = fromExchangeCompaniesReducer.adapter.getSelectors(selectExchangeCompaniesState);

export const getExchangeCompaniesLoading = createSelector(
  selectExchangeCompaniesState, fromExchangeCompaniesReducer.getLoading
);
export const getExchangeCompaniesLoadingError = createSelector(
  selectExchangeCompaniesState, fromExchangeCompaniesReducer.getLoadingError
);

export const getAddExchangeCompaniesModalOpen = createSelector(
  selectExchangeCompaniesState, fromExchangeCompaniesReducer.getAddModalOpen
);

export const getExchangeCompaniesAdding = createSelector(
  selectExchangeCompaniesState, fromExchangeCompaniesReducer.getAdding
);

export const getExchangeCompaniesAddingError = createSelector(
  selectExchangeCompaniesState, fromExchangeCompaniesReducer.getAddingError
);

// Available Companies Selectors
export const {
  selectAll: getAvailableCompanies
} = fromAvailableCompaniesReducer.adapter.getSelectors(selectAvailableCompaniesState);

export const getAvailableCompaniesLoading = createSelector(selectAvailableCompaniesState, fromAvailableCompaniesReducer.getLoading);
export const getAvailableCompaniesLoadingError = createSelector(
  selectAvailableCompaniesState,
  fromAvailableCompaniesReducer.getLoadingError
);
export const getTotalAvailableCompanies = createSelector(selectAvailableCompaniesState, fromAvailableCompaniesReducer.getTotal);
export const getAvailableCompaniesGrid = createSelector(
  getAvailableCompanies,
  getTotalAvailableCompanies,
  (data, total) => {
    return {data: data, total: total};
  }
);

// TODO: Use exchange-jobs reducer when avail
// Exchange Jobs Selectors
export const getAddExchangeJobsModalOpen = createSelector(
  selectAvailableJobsState, fromAvailableJobsReducer.getAddModalOpen
);

export const getExchangeJobsAdding = createSelector(
  selectAvailableJobsState, fromAvailableJobsReducer.getAdding
);

export const getExchangeJobsAddingError = createSelector(
  selectAvailableJobsState, fromAvailableJobsReducer.getAddingError
);


// Available Jobs Selectors
export const {
  selectAll: getAvailableJobs
} = fromAvailableJobsReducer.adapter.getSelectors(selectAvailableJobsState);

export const getAvailableJobsLoading = createSelector(selectAvailableJobsState, fromAvailableJobsReducer.getLoading);
export const getAvailableJobsLoadingError = createSelector(
  selectAvailableCompaniesState,
  fromAvailableCompaniesReducer.getLoadingError
);
export const getTotalAvailableJobs = createSelector(selectAvailableJobsState, fromAvailableJobsReducer.getTotal);
export const getAvailableJobsGrid = createSelector(
  getAvailableJobs,
  getTotalAvailableJobs,
  (data, total) => {
    return {data: data, total: total};
  }
);
