import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromAddJobModalReducer from './add-job-modal.reducer';
import * as fromBulkExportPopoverReducer from './bulk-export-popover.reducer';
import * as fromJobDescriptionReducer from './job-description.reducer';
import * as fromJobDescriptionGridReducer from './job-description-grid.reducer';
import * as fromJobDescriptionHistoryListReducer from './job-description-history-list.reducer';
import * as fromJobInformationFieldsReducer from './job-information-fields.reducer';
import * as fromPublicViewHeaderReducer from './public-view-header.reducer';
import * as fromUserFilterReducer from './user-filter.reducer';
import * as fromJobDescriptionJobCompareReducer from './job-description-job-compare.reducer';
import * as fromJobDescriptionVersionCompareReducer from './job-description-version-compare.reducer';
import * as fromJobMatchesReducer from './job-matches.reducer';
import * as fromWorkflowReducer from './workflow.reducer';
import * as fromEmployeeAcknowledgementReducer from './employee-acknowledgement.reducer';
import * as fromFlsaQuestionnaireReducer from './job-description-flsa-questionnaire.reducer';
import * as fromCopyJobDescriptionModalReducer from './copy-job-description-modal.reducer';
import * as fromJobDescriptionListReducer from './job-description-list.reducer';
import * as fromWorkflowSetupModalReducer from './workflow-setup-modal.reducer';
import * as fromJobDescriptionWorkflowCompareReducer from './job-description-workflow-compare.reducer';

// Feature area state
export interface JobDescriptionManagementJobDescriptionState {
  addJobModal: fromAddJobModalReducer.State;
  bulkExportPopover: fromBulkExportPopoverReducer.State;
  jobDescription: fromJobDescriptionReducer.State;
  jobDescriptionGrid: fromJobDescriptionGridReducer.State;
  jobDescriptionHistoryList: fromJobDescriptionHistoryListReducer.State;
  jobInformationFields: fromJobInformationFieldsReducer.State;
  jobDescriptionJobCompare: fromJobDescriptionJobCompareReducer.State;
  jobDescriptionVersionCompare: fromJobDescriptionVersionCompareReducer.State;
  jobDescriptionWorkflowCompare: fromJobDescriptionWorkflowCompareReducer.State;
  publicViewHeader: fromPublicViewHeaderReducer.State;
  userFilter: fromUserFilterReducer.State;
  jobMatches: fromJobMatchesReducer.State;
  jobDescriptionWorkflow: fromWorkflowReducer.State;
  employeeAcknowledgement: fromEmployeeAcknowledgementReducer.State;
  flsaQuestionnaire: fromFlsaQuestionnaireReducer.State;
  copyJobDescriptionModal: fromCopyJobDescriptionModalReducer.State;
  jobDescriptionList: fromJobDescriptionListReducer.State;
  workflowSetupModal: fromWorkflowSetupModalReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  jobDescriptionManagement_jobDescription: JobDescriptionManagementJobDescriptionState;
}

// Feature area reducers
export const reducers = {
  addJobModal: fromAddJobModalReducer.reducer,
  bulkExportPopover: fromBulkExportPopoverReducer.reducer,
  jobDescription: fromJobDescriptionReducer.reducer,
  jobDescriptionGrid: fromJobDescriptionGridReducer.reducer,
  jobDescriptionHistoryList: fromJobDescriptionHistoryListReducer.reducer,
  jobInformationFields: fromJobInformationFieldsReducer.reducer,
  publicViewHeader: fromPublicViewHeaderReducer.reducer,
  userFilter: fromUserFilterReducer.reducer,
  jobDescriptionJobCompare: fromJobDescriptionJobCompareReducer.reducer,
  jobDescriptionVersionCompare: fromJobDescriptionVersionCompareReducer.reducer,
  jobMatches: fromJobMatchesReducer.reducer,
  jobDescriptionWorkflow: fromWorkflowReducer.reducer,
  employeeAcknowledgement: fromEmployeeAcknowledgementReducer.reducer,
  flsaQuestionnaire: fromFlsaQuestionnaireReducer.reducer,
  copyJobDescriptionModal: fromCopyJobDescriptionModalReducer.reducer,
  jobDescriptionList: fromJobDescriptionListReducer.reducer,
  workflowSetupModal: fromWorkflowSetupModalReducer.reducer,
  jobDescriptionWorkflowCompare: fromJobDescriptionWorkflowCompareReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<JobDescriptionManagementJobDescriptionState>(
  'jobDescriptionManagement_jobDescription');

// Feature Selectors
export const selectAddJobModalState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementJobDescriptionState) => state.addJobModal
);

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

export const selectJobDescriptionJobCompareState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementJobDescriptionState) => state.jobDescriptionJobCompare
);

export const selectJobDescriptionVersionCompareState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementJobDescriptionState) => state.jobDescriptionVersionCompare
);

export const selectJobDescriptionWorkflowCompareState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementJobDescriptionState) => state.jobDescriptionWorkflowCompare
);

export const selectUserFilterState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementJobDescriptionState) => state.userFilter
);

export const selectJobMatchesState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementJobDescriptionState) => state.jobMatches
);

export const selectWorkflowState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementJobDescriptionState) => state.jobDescriptionWorkflow
);

export const selectEmployeeAcknowledgementState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementJobDescriptionState) => state.employeeAcknowledgement
);

export const selectFlsaQuestionnaireState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementJobDescriptionState) => state.flsaQuestionnaire
);

export const selectCopyJobDescriptionModalState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementJobDescriptionState) => state.copyJobDescriptionModal
);

export const selectJobDescriptionListState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementJobDescriptionState) => state.jobDescriptionList
);

export const selectWorkflowSetupModalState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementJobDescriptionState) => state.workflowSetupModal
);

// Add Job Modal
export const getCompanyJob = createSelector(
  selectAddJobModalState,
  fromAddJobModalReducer.getCompanyJob
);

export const getCompanyJobCreating = createSelector(
  selectAddJobModalState,
  fromAddJobModalReducer.getCompanyJobCreating
);

export const getCompanyJobCreatingError = createSelector(
  selectAddJobModalState,
  fromAddJobModalReducer.getCompanyJobCreatingError
);

export const getCompanyJobCreatingErrorMessage = createSelector(
  selectAddJobModalState,
  fromAddJobModalReducer.getCompanyJobCreatingErrorMessage
);

export const getCompanyJobCreatingSuccess = createSelector(
  selectAddJobModalState,
  fromAddJobModalReducer.getCompanyJobCreatingSuccess
);

export const getCompanyJobUdfColumns = createSelector(
  selectAddJobModalState,
  fromAddJobModalReducer.getCompanyJobUdfColumns
);

export const getCompanyJobUdfColumnsLoading = createSelector(
  selectAddJobModalState,
  fromAddJobModalReducer.getCompanyJobUdfColumnsLoading
);

export const getCompanyJobUdfColumnsLoadingError = createSelector(
  selectAddJobModalState,
  fromAddJobModalReducer.getCompanyJobUdfColumnsLoadingError
);

export const getDuplicateCompanyJobMessage = createSelector(
  selectAddJobModalState,
  fromAddJobModalReducer.getDuplicateCompanyJobMessage
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

// Job Description List
export const getJobDescriptionCreating = createSelector(
  selectJobDescriptionListState,
  fromJobDescriptionListReducer.getJobDescriptionCreating
);

export const getJobDescriptionCreatingError = createSelector(
  selectJobDescriptionListState,
  fromJobDescriptionListReducer.getJobDescriptionCreatingError
);

export const getJobDescriptionDraftCreating = createSelector(
  selectJobDescriptionListState,
  fromJobDescriptionListReducer.getJobDescriptionDraftCreating
);

export const getJobDescriptionDraftCreatingError = createSelector(
  selectJobDescriptionListState,
  fromJobDescriptionListReducer.getJobDescriptionDraftCreatingError
);

export const getCompanyJobsJobDescriptionTemplateIdSaving = createSelector(
  selectJobDescriptionListState,
  fromJobDescriptionListReducer.getCompanyJobsJobDescriptionTemplateIdSaving
);

export const getCompanyJobsJobDescriptionTemplateIdSavingError = createSelector(
  selectJobDescriptionListState,
  fromJobDescriptionListReducer.getCompanyJobsJobDescriptionTemplateIdSavingError
);

export const getCompanyJobsJobDescriptionTemplateIdSavingErrorMessage = createSelector(
  selectJobDescriptionListState,
  fromJobDescriptionListReducer.getCompanyJobsJobDescriptionTemplateIdSavingErrorMessage
);

export const getCompanyJobsJobDescriptionTemplateIdSavingSuccess = createSelector(
  selectJobDescriptionListState,
  fromJobDescriptionListReducer.getCompanyJobsJobDescriptionTemplateIdSavingSuccess
);

// Job Description
export const getJobDescriptionAsync = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getJobDescriptionAsync
);

export const getEditingJobDescription = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getEditingJobDescription
);

export const getSavingJobDescription = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getSavingJobDescription
);

export const getJobDescriptionChangeHistory = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getJobDescriptionChangeHistory
);

export const getPublishingJobDescription = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getPublishingJobDescription
);

export const getPublishButtonEnabled = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getPublishButtonEnabled
);

export const getInHistory = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getInHistory
);

export const getJobDescriptionIsFullscreen = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getJobDescriptionIsFullscreen
);

export const getUndoJobDescriptionChangesComplete = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getUndoJobDescriptionChangesComplete
);

export const getReplaceJobDescriptionComplete = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getReplaceJobDescriptionComplete
);

export const getJobDescriptionExtendedInfo = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getJobDescriptionExtendedInfo
);

export const getJobDescriptionViewsAsync = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getJobDescriptionViewsAsync
);

export const getDeletingJobDescription = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getDeletingJobDescription
);

export const getDeletingJobDescriptionSuccess = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getDeletingJobDescriptionSuccess
);

export const getDeletingJobDescriptionError = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getDeletingJobDescriptionError
);

export const getJobDescriptionExtendedInfoAsync = createSelector(
  selectJobDescriptionState,
  fromJobDescriptionReducer.getJobDescriptionExtendedInfoAsync
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

export const getBulkExportError = createSelector(
  selectBulkExportPopoverState,
  fromBulkExportPopoverReducer.getBulkExportError
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

export const getUserFilterError = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getUserFilterError
);

export const getUserFilterDeleting = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getUserFilterDeleting
);

export const getUserFilterList = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getUserFilterList
);

export const getUserFilterLoading = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getUserFilterLoading
);

export const getUserFilterErrorMessage = createSelector(
  selectUserFilterState,
  fromUserFilterReducer.getUserFilterErrorMessage
);

// JDM Job Compare
export const getJobDescriptionJobCompareJobDescriptionList = createSelector(
  selectJobDescriptionJobCompareState,
  fromJobDescriptionJobCompareReducer.getJobDescriptionList
);

export const getJobDescriptionJobCompareComparisonDiffAsync = createSelector(
  selectJobDescriptionJobCompareState,
  fromJobDescriptionJobCompareReducer.getJobDescriptionComparisonDiffAsync
);

export const getJobDescriptionJobCompareSourceJobDescriptionAsync = createSelector(
  selectJobDescriptionJobCompareState,
  fromJobDescriptionJobCompareReducer.getSourceJobDescriptionAsync
);

export const getJobDescriptionForComparisonAsync = createSelector(
  selectJobDescriptionJobCompareState,
  fromJobDescriptionJobCompareReducer.getJobDescriptionForComparisonAsync
);

export const getJobDescriptionSaving = createSelector(
  selectJobDescriptionJobCompareState,
  fromJobDescriptionJobCompareReducer.getJobDescriptionSaving
);

export const getJobDescriptionSaveError = createSelector(
  selectJobDescriptionJobCompareState,
  fromJobDescriptionJobCompareReducer.getJobDescriptionSaveError
);

// JDM Version Compare

export const getComparisonHistoryListItem = createSelector(
  selectJobDescriptionVersionCompareState,
  fromJobDescriptionVersionCompareReducer.getComparisonHistoryListItem
);

export const getJobDescriptionComparisonLoading = createSelector(
  selectJobDescriptionVersionCompareState,
  fromJobDescriptionVersionCompareReducer.getJobDescriptionComparisonLoading
);

export const getJobDescriptionComparisonLoadingError = createSelector(
  selectJobDescriptionVersionCompareState,
  fromJobDescriptionVersionCompareReducer.getJobDescriptionComparisonLoadingError
);

export const getJobDescriptionComparison = createSelector(
  selectJobDescriptionVersionCompareState,
  fromJobDescriptionVersionCompareReducer.getJobDescriptionComparison
);

export const getSourceHistoryListItem = createSelector(
   selectJobDescriptionVersionCompareState,
   fromJobDescriptionVersionCompareReducer.getSourceHistoryListItem
);

// Job Matches
export const getJobMatchesAsync = createSelector(
  selectJobMatchesState,
  fromJobMatchesReducer.getJobMatchesAsync
);

export const getJobMatchesForbidden = createSelector(
  selectJobMatchesState,
  fromJobMatchesReducer.getJobMatchesForbidden
);

export const getCreatingProject = createSelector(
  selectJobMatchesState,
  fromJobMatchesReducer.getCreatingProject
);

export const getCreatingProjectError = createSelector(
  selectJobMatchesState,
  fromJobMatchesReducer.getCreatingProjectError
);

// Workflow
export const getWorkflow = createSelector(
  selectWorkflowState,
  fromWorkflowReducer.getWorkflow
);

export const getWorkflowSaveObj = createSelector(
  selectWorkflowState,
  fromWorkflowReducer.getWorkflowSaveObj
);

export const getWorkflowSaving = createSelector(
  selectWorkflowState,
  fromWorkflowReducer.getWorkflowSaving
);
// Workflow log
export const getWorkflowLogEntries = createSelector(
  selectWorkflowState,
  fromWorkflowReducer.getWorkflowLogEntries
);

export const getWorkflowLogLoading = createSelector(
  selectWorkflowState,
  fromWorkflowReducer.getWorkflowLogLoading
);

// Workflow step
export const getWorkflowStepApproving = createSelector(
  selectWorkflowState,
  fromWorkflowReducer.getWorkflowStepApproving
);

export const getWorkflowStepRejecting = createSelector(
  selectWorkflowState,
  fromWorkflowReducer.getWorkflowStepRejecting
);

// Workflow Step Summary
export const getWorkflowStepSummaryAsync = createSelector(
  selectWorkflowState,
  fromWorkflowReducer.getWorkflowStepSummaryAsync
);

export const getWorkflowStepSummaryAsyncLoading = createSelector(
  selectWorkflowState,
  fromWorkflowReducer.getWorkflowStepSummaryAsyncLoading
);

// Workflow Link
export const getWorkflowLink = createSelector(
  selectWorkflowState,
  fromWorkflowReducer.getWorkflowLink
);

export const getWorkflowLinkLoading = createSelector(
  selectWorkflowState,
  fromWorkflowReducer.getLoading
);

export const getWorkflowLinkLoaded = createSelector(
  selectWorkflowState,
  fromWorkflowReducer.getLoaded
);

// Workflowstep Complete messages
export const getMessage = createSelector(
  selectWorkflowState,
  fromWorkflowReducer.getMessage
);

export const getCompletedStep = createSelector(
  selectWorkflowState,
  fromWorkflowReducer.getCompletedStep
);


// Employee Acknowledgement
export const getEmployeeAcknowledgementError = createSelector(
  selectEmployeeAcknowledgementState,
  fromEmployeeAcknowledgementReducer.getEmployeeAcknowledgementError
);

export const getAcknowledging = createSelector(
  selectEmployeeAcknowledgementState,
  fromEmployeeAcknowledgementReducer.getAcknowledging
);

export const getEmployeeAcknowledgementAsync = createSelector(
  selectEmployeeAcknowledgementState,
  fromEmployeeAcknowledgementReducer.getEmployeeAcknowledgementAsync
);

export const getEmployeeAcknowledgementErrorMessage = createSelector(
  selectEmployeeAcknowledgementState,
  fromEmployeeAcknowledgementReducer.getEmployeeAcknowledgementErrorMessage
);

// FLSA Questionnaire
export const getFlsaQuestionnaireAsync = createSelector(
  selectFlsaQuestionnaireState,
  fromFlsaQuestionnaireReducer.getFlsaQuestionnaireDetails
);

export const getSavingFlsaQuestionnaire = createSelector(
  selectFlsaQuestionnaireState,
  fromFlsaQuestionnaireReducer.getSavingFlsaQuestionnaireDetails
);

// Copy Job Description Modal
export const getJobDescriptionSourcesAsync = createSelector(
  selectCopyJobDescriptionModalState,
  fromCopyJobDescriptionModalReducer.getJobDescriptionSourcesAsync
);

// Workflow Setup Modal
export const getWorkflowSetupSaving = createSelector(
  selectWorkflowSetupModalState,
  fromWorkflowSetupModalReducer.getWorkflowSetupSaving
);

export const getWorkflowSetupSavingSuccess = createSelector(
  selectWorkflowSetupModalState,
  fromWorkflowSetupModalReducer.getWorkflowSetupSavingSuccess
);

// JDM Workflow Compare
export const getComparisonWorkflowListItem = createSelector(
  selectJobDescriptionWorkflowCompareState,
  fromJobDescriptionWorkflowCompareReducer.getJobDescriptionWorkflowList
);

export const getJobDescriptionWorkflowComparisonLoading = createSelector(
  selectJobDescriptionWorkflowCompareState,
  fromJobDescriptionWorkflowCompareReducer.getJobDescriptionComparisonLoading
);

export const getJobDescriptionWorkflowComparisonLoadingError = createSelector(
  selectJobDescriptionWorkflowCompareState,
  fromJobDescriptionWorkflowCompareReducer.getJobDescriptionComparisonLoadingError
);

export const getJobDescriptionWorkflowComparison = createSelector(
  selectJobDescriptionWorkflowCompareState,
  fromJobDescriptionWorkflowCompareReducer.getJobDescriptionComparison
);

export const getSourceCompareListItem = createSelector(
  selectJobDescriptionWorkflowCompareState,
  fromJobDescriptionWorkflowCompareReducer.getSourceCompareItem
);

export const getComparisonCompareListItem = createSelector(
  selectJobDescriptionWorkflowCompareState,
  fromJobDescriptionWorkflowCompareReducer.getComparisonCompareItem
);

export const getCompareListLoading = createSelector(
  selectJobDescriptionWorkflowCompareState,
  fromJobDescriptionWorkflowCompareReducer.getCompareListLoading
);

export const getCompareListError = createSelector(
  selectJobDescriptionWorkflowCompareState,
  fromJobDescriptionWorkflowCompareReducer.getCompareListError
);
