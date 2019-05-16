import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromBulkExportPopoverReducer from './bulk-export-popover.reducer';
import * as fromJobDescriptionReducer from './job-description.reducer';
import * as fromJobDescriptionGridReducer from './job-description-grid.reducer';
import * as fromJobDescriptionHistoryListReducer from './job-description-history-list.reducer';
import * as fromJobInformationFieldsReducer from './job-information-fields.reducer';
import * as fromPublicViewHeaderReducer from './public-view-header.reducers';
import * as fromUserFilterReducer from './user-filter.reducer';

// Feature area state
export interface JobDescriptionManagementJobDescriptionState {
  bulkExportPopover: fromBulkExportPopoverReducer.State;
  jobDescription: fromJobDescriptionReducer.State;
  jobDescriptionGrid: fromJobDescriptionGridReducer.State;
  jobDescriptionHistoryList: fromJobDescriptionHistoryListReducer.State;
  jobInformationFields: fromJobInformationFieldsReducer.State;
  publicViewHeader: fromPublicViewHeaderReducer.State;
  userFilter: fromUserFilterReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  jobDescriptionManagement_jobDescription: JobDescriptionManagementJobDescriptionState;
}

// Feature area reducers
export const reducers = {
  bulkExportPopover: fromBulkExportPopoverReducer.reducer,
  jobDescription: fromJobDescriptionReducer.reducer,
  jobDescriptionGrid: fromJobDescriptionGridReducer.reducer,
  jobDescriptionHistoryList: fromJobDescriptionHistoryListReducer.reducer,
  jobInformationFields: fromJobInformationFieldsReducer.reducer,
  publicViewHeader: fromPublicViewHeaderReducer.reducer,
  userFilter: fromUserFilterReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<JobDescriptionManagementJobDescriptionState>(
  'jobDescriptionManagement_jobDescription');

// Feature Selectors
export const selectBulkExportPopoverState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementJobDescriptionState) => state.bulkExportPopover
);

export const selectJobDescriptionState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementJobDescriptionState) => state.jobDescription
);

export const selectJobDescriptionGridState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementJobDescriptionState) => state.jobDescriptionGrid
);

export const selectJobDescriptionHistoryListState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementJobDescriptionState) => state.jobDescriptionHistoryList
);

export const selectJobInformationFieldsState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementJobDescriptionState) => state.jobInformationFields
);

export const selectPublicViewHeaderState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementJobDescriptionState) => state.publicViewHeader
);

export const selectUserFilterState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementJobDescriptionState) => state.userFilter
);

// Bulk Export Popover
export const getControlLabelsLoading = createSelector(
  selectBulkExportPopoverState,
  fromBulkExportPopoverReducer.getControlLabelsLoading
);

export const getControlLabelsLoadingError = createSelector(
  selectBulkExportPopoverState,
  fromBulkExportPopoverReducer.getControlLabelsLoadingError
);

export const getControlLabels = createSelector(
  selectBulkExportPopoverState,
  fromBulkExportPopoverReducer.getControlLabels
);

export const getViewNamesLoading = createSelector(
  selectBulkExportPopoverState,
  fromBulkExportPopoverReducer.getViewNamesLoading
);

export const getViewNamesLoadingError = createSelector(
  selectBulkExportPopoverState,
  fromBulkExportPopoverReducer.getViewNamesLoadingError
);

export const getViewNames = createSelector(
  selectBulkExportPopoverState,
  fromBulkExportPopoverReducer.getViewNames
);

export const getNoPublishedJobDescriptions = createSelector(
  selectBulkExportPopoverState,
  fromBulkExportPopoverReducer.getNoPublishedJobDescriptions
);

// Job Description
export const getCreatedJobDescriptionId = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getCreatedJobDescriptionId
);

export const getCreatedJobDescriptionDraft = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getCreatedJobDescriptionDraft
);

export const getJobDescriptionCreating = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getJobDescriptionCreating
);

export const getJobDescriptionCreatingError = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getJobDescriptionCreatingError
);

export const getJobDescriptionDraftCreating = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getJobDescriptionDraftCreating
);

export const getJobDescriptionDraftCreatingError = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getJobDescriptionDraftCreatingError
);

export const getCompanyJobsJobDescriptionTemplateIdSaving = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getCompanyJobsJobDescriptionTemplateIdSaving
);

export const getCompanyJobsJobDescriptionTemplateIdSavingError = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getCompanyJobsJobDescriptionTemplateIdSavingError
);

export const getCompanyJobsJobDescriptionTemplateIdSavingResponse = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getCompanyJobsJobDescriptionTemplateIdSavingResponse
);

// Job Description Grid
export const getJobDescriptionGridLoading = createSelector(
  selectJobDescriptionGridState,
  fromJobDescriptionGridReducer.getJobDescriptionGridLoading
);

export const getJobDescriptionGridLoadingError = createSelector(
  selectJobDescriptionGridState,
  fromJobDescriptionGridReducer.getJobDescriptionGridLoadingError
);

export const getGridDataResult = createSelector(
  selectJobDescriptionGridState,
  fromJobDescriptionGridReducer.getGridDataResult
);

export const getGridState = createSelector(
  selectJobDescriptionGridState,
  fromJobDescriptionGridReducer.getGridState
);

export const getListAreaColumns = createSelector(
  selectJobDescriptionGridState,
  fromJobDescriptionGridReducer.getListAreaColumns
);

export const getListAreaColumnsSaving = createSelector(
  selectJobDescriptionGridState,
  fromJobDescriptionGridReducer.getListAreaColumnsSaving
);

export const getListAreaColumnsSavingError = createSelector(
  selectJobDescriptionGridState,
  fromJobDescriptionGridReducer.getListAreaColumnsSavingError
);

export const getListAreaColumnsSavingSuccess = createSelector(
  selectJobDescriptionGridState,
  fromJobDescriptionGridReducer.getListAreaColumnsSavingSuccess
);

export const getListAreaColumnsToUpdate = createSelector(
  selectJobDescriptionGridState,
  fromJobDescriptionGridReducer.getListAreaColumnsToUpdate
);

export const getSearchTerm = createSelector(
  selectJobDescriptionGridState,
  fromJobDescriptionGridReducer.getSearchTerm
);

// Job Description History List
export const getJobDescriptionHistoryList = createSelector(
  selectJobDescriptionHistoryListState,
  fromJobDescriptionHistoryListReducer.getJobDescriptionHistoryList
);

export const getJobDescriptionHistoryListLoading = createSelector(
  selectJobDescriptionHistoryListState,
  fromJobDescriptionHistoryListReducer.getJobDescriptionHistoryListLoading
);

export const getJobDescriptionHistoryListLoadingError = createSelector(
  selectJobDescriptionHistoryListState,
  fromJobDescriptionHistoryListReducer.getJobDescriptionHistoryListLoadingError
);

// Job Information Fields
export const getJobInformationFieldsForBulkExportLoading = createSelector(
  selectJobInformationFieldsState,
  fromJobInformationFieldsReducer.getJobInformationFieldsForBulkExportLoading
);

export const getJobInformationFieldsForBulkExportLoadingError = createSelector(
  selectJobInformationFieldsState,
  fromJobInformationFieldsReducer.getJobInformationFieldsForBulkExportLoadingError
);

export const getJobInformationFieldsForBulkExport = createSelector(
  selectJobInformationFieldsState,
  fromJobInformationFieldsReducer.getJobInformationFieldsForBulkExport
);

// Public View Header
export const getCompany = createSelector(
  selectPublicViewHeaderState,
  fromPublicViewHeaderReducer.getCompany
);

export const getCompanyInformationLoading = createSelector(
  selectPublicViewHeaderState,
  fromPublicViewHeaderReducer.getCompanyInformationLoading
);

export const getCompanyInformationLoadingError = createSelector(
  selectPublicViewHeaderState,
  fromPublicViewHeaderReducer.getCompanyInformationLoadingError
);

// User Filter
export const getUserFilterAdding = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getUserFilterAdding
);

export const getUserFilterAddingError = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getUserFilterAddingError
);

export const getUserFilterAddingSuccess = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getUserFilterAddingSuccess
);

export const getUserFilterDeleting = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getUserFilterDeleting
);

export const getUserFilterDeletingError = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getUserFilterDeletingError
);

export const getUserFilterList = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getUserFilterList
);

export const getUserFilterLoading = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getUserFilterLoading
);

export const getUserFilterLoadingError = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getUserFilterLoadingError
);

export const getUserFilterLoadingErrorMessage = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getUserFilterLoadingErrorMessage
);
