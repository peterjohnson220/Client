import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromManageExchangeReducer from './manage-exchange.reducer';
import * as fromExchangeCompaniesReducer from './exchange-companies.reducer';
import * as fromImportExchangeJobsReducer from './import-exchange-jobs.reducer';
import * as fromAvailableCompaniesReducer from './available-companies.reducer';
import * as fromExchangeJobsReducer from './exchange-jobs.reducer';
import * as fromAvailableJobsReducer from './available-jobs.reducer';
import * as fromGridReducer from 'libs/common/core/reducers/grid.reducer';
import { IFeatureGridState } from 'libs/common/core/reducers/grid.reducer';

// Feature area state
export interface PeerAdminState {
  manageExchange: fromManageExchangeReducer.State;
  exchangeCompanies: fromExchangeCompaniesReducer.State;
  importExchangeJobs: fromImportExchangeJobsReducer.State;
  availableCompanies: IFeatureGridState<fromAvailableCompaniesReducer.State>;
  availableJobs: IFeatureGridState<fromAvailableJobsReducer.State>;
  exchangeJobs: fromExchangeJobsReducer.State;
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
  exchangeJobs: fromExchangeJobsReducer.reducer,
  availableJobs: fromAvailableJobsReducer.reducer
};

// Select Feature Area
export const selectPeerAdminState = createFeatureSelector<PeerAdminState>('peerAdmin');

// Feature Selectors
export const selectManageExchangeState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.manageExchange);
export const selectExchangeCompaniesState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.exchangeCompanies);
export const selectImportExchangeJobsState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.importExchangeJobs);
export const selectExchangeJobsState = createSelector(selectPeerAdminState, (state: PeerAdminState) => state.exchangeJobs);
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

export const getAvailableCompaniesLoading = createSelector(selectAvailableCompaniesFeatureState, fromAvailableCompaniesReducer.getLoading);
export const getAvailableCompaniesLoadingError = createSelector(
  selectAvailableCompaniesFeatureState,
  fromAvailableCompaniesReducer.getLoadingError
);
export const getTotalAvailableCompanies = createSelector(selectAvailableCompaniesFeatureState, fromAvailableCompaniesReducer.getTotal);
export const getAvailableCompaniesGridState = createSelector(selectAvailableCompaniesGridState, fromGridReducer.getGridState);
export const getAvailableCompaniesGridSelections = createSelector(selectAvailableCompaniesGridState, fromGridReducer.getGridSelections);
export const getAvailableCompaniesGrid = createSelector(
  getAvailableCompanies,
  getTotalAvailableCompanies,
  (data, total) => {
    return {data: data, total: total};
  }
);

// Exchange Jobs Selectors
export const {
  selectAll: getExchangeJobs
} = fromExchangeJobsReducer.adapter.getSelectors(selectExchangeJobsState);

export const getExchangeJobsLoading = createSelector(
  selectExchangeJobsState, fromExchangeJobsReducer.getLoading
);
export const getExchangeJobsLoadingError = createSelector(
  selectExchangeJobsState, fromExchangeJobsReducer.getLoadingError
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

// TODO: Use exchange-jobs reducer when avail
// Exchange Jobs Selectors
export const getAddExchangeJobsModalOpen = createSelector(
  selectAvailableJobsFeatureState, fromAvailableJobsReducer.getAddModalOpen
);

export const getExchangeJobsAdding = createSelector(
  selectAvailableJobsFeatureState, fromAvailableJobsReducer.getAdding
);

export const getExchangeJobsAddingError = createSelector(
  selectAvailableJobsFeatureState, fromAvailableJobsReducer.getAddingError
);

export const {
  selectAll: getAvailableJobs
} = fromAvailableJobsReducer.adapter.getSelectors(selectAvailableJobsFeatureState);

export const getAvailableJobsLoading = createSelector(selectAvailableJobsFeatureState, fromAvailableJobsReducer.getLoading);
export const getAvailableJobsLoadingError = createSelector(
  selectAvailableJobsFeatureState,
  fromAvailableJobsReducer.getLoadingError
);
export const getTotalAvailableJobs = createSelector(selectAvailableJobsFeatureState, fromAvailableJobsReducer.getTotal);
export const getAvailableJobsGridState = createSelector(selectAvailableJobsGridState, fromGridReducer.getGridState);
export const getAvailableJobsGridSelections = createSelector(selectAvailableJobsGridState, fromGridReducer.getGridSelections);
export const getAvailableJobsGrid = createSelector(
  getAvailableJobs,
  getTotalAvailableJobs,
  (data, total) => {
    return {data: data, total: total};
  }
);
