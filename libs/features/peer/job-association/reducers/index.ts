import { createSelector, createFeatureSelector } from '@ngrx/store';

import { IFeatureGridState } from 'libs/core/reducers/grid.reducer';
import * as fromRoot from 'libs/state/state';
import * as fromGridReducer from 'libs/core/reducers/grid.reducer';

// Import feature reducers
import * as fromCompanyJobsReducer from './company-jobs.reducer';
import * as fromExchangeJobsReducer from './exchange-jobs.reducer';
import * as fromJobAssociationModalReducer from './job-association-modal.reducer';

// Feature area state
export interface JobAssociationFeatureState {
  companyJobs: IFeatureGridState<fromCompanyJobsReducer.State>;
  exchangeJobs: IFeatureGridState<fromExchangeJobsReducer.State>;
  jobAssociationModal: fromJobAssociationModalReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_job_association: JobAssociationFeatureState;
}

// Feature area reducers
export const reducers = {
  companyJobs: fromCompanyJobsReducer.reducer,
  exchangeJobs: fromExchangeJobsReducer.reducer,
  jobAssociationModal: fromJobAssociationModalReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState =
  createFeatureSelector<JobAssociationFeatureState>('feature_job_association');

// Feature Selectors
export const selectExchangeJobsState = createSelector(
  selectFeatureAreaState,
  (state: JobAssociationFeatureState) => state.exchangeJobs);

export const selectCompanyJobsState = createSelector(
  selectFeatureAreaState,
  (state: JobAssociationFeatureState) => state.companyJobs);

export const selectJobAssociationModalState = createSelector(
  selectFeatureAreaState,
  (state: JobAssociationFeatureState) => state.jobAssociationModal);

// Job Association Modal Selectors
export const getJobAssociationModalSaving = createSelector(
  selectJobAssociationModalState,
  fromJobAssociationModalReducer.getSaving);

export const getJobAssociationModalSavingSuccess = createSelector(
  selectJobAssociationModalState,
  fromJobAssociationModalReducer.getSavingSuccess);

export const getJobAssociationModalSavingError = createSelector(
  selectJobAssociationModalState,
  fromJobAssociationModalReducer.getSavingError);

export const getJobAssociationModalIsOpen = createSelector(
  selectJobAssociationModalState,
  fromJobAssociationModalReducer.getIsModalOpen);

export const getJobAssociationModalShowUnsavedChangesWarning = createSelector(
  selectJobAssociationModalState,
  fromJobAssociationModalReducer.getShowUnsavedChangesWarning);

// Exchange Jobs Selectors
export const getExchangeJobsGrid = createSelector(
  selectExchangeJobsState,
  (state: IFeatureGridState<fromExchangeJobsReducer.State>) => state.grid);

export const getExchangeJobsGridState = createSelector(
  getExchangeJobsGrid,
  fromGridReducer.getGridState);

export const getExchangeJobsFeature = createSelector(
  selectExchangeJobsState,
  (state: IFeatureGridState<fromExchangeJobsReducer.State>) => state.feature);

export const getExchangeJobsLoading = createSelector(
  getExchangeJobsFeature,
  (feature) => feature.loading
);

export const getExchangeJobsLoadingError = createSelector(
  getExchangeJobsFeature,
  (feature) => feature.loadingError
);

export const getExchangeJobsLoadingBadRequestError = createSelector(
  getExchangeJobsFeature,
  (feature) => feature.badRequestMessage
);

export const getExchangeJobsSearchTerm = createSelector(
  getExchangeJobsFeature,
  (feature) => feature.searchTerm
);

export const getExchangeJobsSelectedExchangeJob = createSelector(
  getExchangeJobsFeature,
  (feature) => feature.selectedExchangeJob
);
export const getSelectedJobFamilies = createSelector(
  getExchangeJobsFeature,
  fromExchangeJobsReducer.getSelectedJobFamilies
);
export const getExchangeJobsIsDetailPanelExpanded = createSelector(
  getExchangeJobsFeature,
  (feature) => feature.isDetailPanelExpanded
);

export const getExchangeJobsExpandedDetailRowId = createSelector(
  getExchangeJobsFeature,
  (feature) => feature.expandedDetailRowId
);
export const {
  selectAll: getExchangeJobsList
} = fromExchangeJobsReducer.adapter.getSelectors(getExchangeJobsFeature);

export const getExchangeJobsTotal = createSelector(
  getExchangeJobsFeature,
  fromExchangeJobsReducer.getTotal
);

export const getExchangeJobsData = createSelector(
  getExchangeJobsList,
  getExchangeJobsTotal,
  (data, total) => ({ data, total })
);

// Exchange Jobs Selectors, job family filter
export const getExchangeJobsFamilyFilterLoading = createSelector(
  getExchangeJobsFeature,
  fromExchangeJobsReducer.getJobFamilyFilterLoading
);

export const getExchangeJobFamilyFilterOptions = createSelector(
  getExchangeJobsFeature,
  fromExchangeJobsReducer.getJobFamilyFilterOptions
);

export const getExchangeJobFamilyFilterSelectedOptionNames = createSelector(
  getExchangeJobsFeature,
  (state) => state.selectedJobFamilies.map(o => o.DisplayName)
);

// Exchange Jobs Selectors, exchange filter
export const getExchangeJobsExchangeFilterLoading = createSelector(
  getExchangeJobsFeature,
  fromExchangeJobsReducer.getExchangeFilterLoading
);

export const getExchangeJobExchangeFilterOptions = createSelector(
  getExchangeJobsFeature,
  fromExchangeJobsReducer.getExchangeFilterOptions
);

export const getExchangeJobExchangeFilterSelectedOptionNames = createSelector(
  getExchangeJobsFeature,
  (state) => state.selectedExchanges.map(o => o.DisplayName)
);

export const getExchangeJobExchangeFilterSelectedOptionIds = createSelector(
  getExchangeJobsFeature,
  (state) => state.selectedExchanges.map(o => o.Id)
);

// Exchange Jobs Selectors, previous associations
export const getPreviousAssociations = createSelector(
  getExchangeJobsFeature,
  (feature) => feature.previousAssociations
);

export const getPreviousAssociationsToDelete = createSelector(
  getExchangeJobsFeature,
  (feature) => feature.previousAssociationsToDelete
);

export const getLoadingPreviousAssociations = createSelector(
  getExchangeJobsFeature,
  (feature) => feature.loadingPreviousAssociations
);

export const getLoadingPreviousAssociationsSuccess = createSelector(
  getExchangeJobsFeature,
  (feature) => feature.loadingPreviousAssociationsSuccess
);

export const getLoadingPreviousAssociationsError = createSelector(
  getExchangeJobsFeature,
  (feature) => feature.loadingPreviousAssociationsError
);

// Company Jobs Selectors
export const getCompanyJobsGrid = createSelector(
  selectCompanyJobsState,
  (state: IFeatureGridState<fromCompanyJobsReducer.State>) => state.grid);

export const getCompanyJobsGridState = createSelector(
  getCompanyJobsGrid,
  (fromGridReducer.getGridState)
);

export const getCompanyJobsFeature = createSelector(
  selectCompanyJobsState,
  (state: IFeatureGridState<fromCompanyJobsReducer.State>) => state.feature);

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
  (feature) => feature.loading
);

export const getCompanyJobsLoadingError = createSelector(
  getCompanyJobsFeature,
  (feature) => feature.loadingError
);

export const getCompanyJobsLoadingBadRequestError = createSelector(
  getCompanyJobsFeature,
  (feature) => feature.badRequestMessage
);

export const getCompanyJobIdFilters = createSelector(
  getCompanyJobsFeature,
  (feature) => feature.companyJobIdFilters
);

export const getCompanyJobsSearchTerm = createSelector(
  getCompanyJobsFeature,
  (feature) => feature.searchTerm
);

// detail panel
export const getCompanyJobsSelectedCompanyJobInDetailPanel = createSelector(
  getCompanyJobsFeature,
  (feature) => feature.selectedCompanyJobInDetailPanel
);

export const getCompanyJobsIsDetailPanelExpanded = createSelector(
  getCompanyJobsFeature,
  (feature) => feature.isDetailPanelExpanded
);

// associations
export const getSelectedCompanyJobs = createSelector(
    getCompanyJobsFeature,
    fromCompanyJobsReducer.getSelectedCompanyJobs);

export const getExchangeJobAssociations = createSelector(
    getExchangeJobsFeature,
    (feature) => feature.ExchangeJobAssociations
);

export const getExchangeJobAssociationsToDelete = createSelector(
  getExchangeJobsFeature,
  (feature) => feature.previousAssociationsToDelete
);
