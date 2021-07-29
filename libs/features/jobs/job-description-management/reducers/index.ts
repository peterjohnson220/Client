import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromCompanyFlsaStatusReducer from './company-flsa-status.reducer';
import * as fromJobFamilyReducer from './job-family.reducer';
import * as fromJobDescriptionAppliesToReducer from './job_description-appliesto.reducer';
import * as fromTemplateListReducer from './template-list.reducer';
import * as fromControlTypesReducer from './control-types.reducer';
import * as fromJobDescriptionLibraryReducer from './job-description-library.reducer';
import * as fromSharedWorkflowReducer from './shared-workflow.reducer';
import * as fromWorkflowConfigReducer from './workflow-config.reducer';
import * as fromCollaborationWorkflowConfigReducer from './collaboration-workflow-config.reducer';
import * as fromCompanyLogoReducer from './company-logo.reducer';
import * as fromJobDescriptionNavigationReducer from './job-description-navigation.reducer';

// Feature area state
export interface JobDescriptionManagementSharedState {
  controlTypes: fromControlTypesReducer.State;
  companyFlsaStatus: fromCompanyFlsaStatusReducer.State;
  jobFamily: fromJobFamilyReducer.State;
  jobDescriptionAppliesTo: fromJobDescriptionAppliesToReducer.State;
  templateList: fromTemplateListReducer.State;
  jobDescriptionLibrary: fromJobDescriptionLibraryReducer.State;
  sharedWorkflow: fromSharedWorkflowReducer.State;
  workflowConfig: fromWorkflowConfigReducer.State;
  collaborationWorkflowConfig: fromCollaborationWorkflowConfigReducer.State;
  companyLogo: fromCompanyLogoReducer.State;
  jobDescriptionNavigation: fromJobDescriptionNavigationReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  jobDescriptionManagement_shared: JobDescriptionManagementSharedState;
}

// Feature area reducers
export const reducers = {
  controlTypes: fromControlTypesReducer.reducer,
  companyFlsaStatus: fromCompanyFlsaStatusReducer.reducer,
  jobFamily: fromJobFamilyReducer.reducer,
  jobDescriptionAppliesTo: fromJobDescriptionAppliesToReducer.reducer,
  templateList: fromTemplateListReducer.reducer,
  jobDescriptionLibrary: fromJobDescriptionLibraryReducer.reducer,
  sharedWorkflow: fromSharedWorkflowReducer.reducer,
  workflowConfig: fromWorkflowConfigReducer.reducer,
  collaborationWorkflowConfig: fromCollaborationWorkflowConfigReducer.reducer,
  companyLogo: fromCompanyLogoReducer.reducer,
  jobDescriptionNavigation: fromJobDescriptionNavigationReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<JobDescriptionManagementSharedState>(
  'jobDescriptionManagement_shared');

// Feature Selectors
export const selectCompanyFlsaStatusState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSharedState) => state.companyFlsaStatus
);

export const selectJobFamilyState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSharedState) => state.jobFamily
);

export const selectJobDescriptionAppliesToState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSharedState) => state.jobDescriptionAppliesTo
);

export const selectControlTypesState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSharedState) => state.controlTypes
);

export const selectTemplateListState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSharedState) => state.templateList
);

export const selectJobDescriptionLibraryState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSharedState) => state.jobDescriptionLibrary
);

export const selectSharedWorkflowState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSharedState) => state.sharedWorkflow
);

export const selectWorkflowConfigState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSharedState) => state.workflowConfig
);

export const selectCollaborationWorkflowConfigState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSharedState) => state.collaborationWorkflowConfig
);

export const selectCompanyLogoState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSharedState) => state.companyLogo
);

export const selectJobDescriptionNavigationState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSharedState) => state.jobDescriptionNavigation
);

// Job Description Navigation
export const getNavigatedToSettings = createSelector(
  selectJobDescriptionNavigationState,
  fromJobDescriptionNavigationReducer.getNavigatedToSettings
);

// Company Logo
export const getCompanyLogo = createSelector(
  selectCompanyLogoState,
  fromCompanyLogoReducer.getCompanyLogoAsync
);

export const getCompany = createSelector(
  selectCompanyLogoState,
  fromCompanyLogoReducer.getCompany
);

export const getCompanyLogos = createSelector(
  selectCompanyLogoState,
  fromCompanyLogoReducer.getCompanyLogos
);

export const getCompanyLogosLoading = createSelector(
  selectCompanyLogoState,
  fromCompanyLogoReducer.getCompanyLogosLoading
);

export const getCompanyLogosLoadingError = createSelector(
  selectCompanyLogoState,
  fromCompanyLogoReducer.getCompanyLogosLoadingError
);

export const getCompanyLogosLoadingErrorMessage = createSelector(
  selectCompanyLogoState,
  fromCompanyLogoReducer.getCompanyLogosLoadingErrorMessage
);

// Company FLSA Status
export const getCompanyFlsaStatuses = createSelector(
  selectCompanyFlsaStatusState,
  fromCompanyFlsaStatusReducer.getCompanyFlsaStatuses
);

export const getCompanyFlsaStatusesLoading = createSelector(
  selectCompanyFlsaStatusState,
  fromCompanyFlsaStatusReducer.getCompanyFlsaStatusesLoading
);

export const getCompanyFlsaStatusesLoadingError = createSelector(
  selectCompanyFlsaStatusState,
  fromCompanyFlsaStatusReducer.getCompanyFlsaStatusesLoadingError
);

// Job Family
export const getJobFamilies = createSelector(
  selectJobFamilyState,
  fromJobFamilyReducer.getJobFamilies
);

export const getJobFamiliesLoading = createSelector(
  selectJobFamilyState,
  fromJobFamilyReducer.getJobFamiliesLoading
);

export const getJobFamiliesLoadingError = createSelector(
  selectJobFamilyState,
  fromJobFamilyReducer.getJobFamiliesLoadingError
);

export const getJobFamiliesLoadingErrorMessage = createSelector(
  selectJobFamilyState,
  fromJobFamilyReducer.getJobFamiliesLoadingErrorMessage
);

// Job Description Applies To
export const getAppliesToAttributesExist = createSelector(
  selectJobDescriptionAppliesToState,
  fromJobDescriptionAppliesToReducer.getAppliesToAttributesExist
);

export const getAppliesToAttributesExistGetting = createSelector(
  selectJobDescriptionAppliesToState,
  fromJobDescriptionAppliesToReducer.getAppliesToAttributesExistGetting
);

export const getAppliesToAttributesExistGettingError = createSelector(
  selectJobDescriptionAppliesToState,
  fromJobDescriptionAppliesToReducer.getAppliesToAttributesExistGettingError
);

export const getJobDescriptionAppliesToItems = createSelector(
  selectJobDescriptionAppliesToState,
  fromJobDescriptionAppliesToReducer.getJobDescriptionAppliesToItems
);

export const getJobDescriptionAppliesToLoading = createSelector(
  selectJobDescriptionAppliesToState,
  fromJobDescriptionAppliesToReducer.getJobDescriptionAppliesToLoading
);

export const getJobDescriptionAppliesToLoadingError = createSelector(
  selectJobDescriptionAppliesToState,
  fromJobDescriptionAppliesToReducer.getJobDescriptionAppliesToLoadingError
);

export const getJobDescriptionAppliesToValues = createSelector(
  selectJobDescriptionAppliesToState,
  fromJobDescriptionAppliesToReducer.getJobDescriptionAppliesToValues
);

export const getJobDescriptionAppliesToValuesLoading = createSelector(
  selectJobDescriptionAppliesToState,
  fromJobDescriptionAppliesToReducer.getJobDescriptionAppliesToValuesLoading
);

export const getJobDescriptionAppliesToValuesLoadingError = createSelector(
  selectJobDescriptionAppliesToState,
  fromJobDescriptionAppliesToReducer.getJobDescriptionAppliesToValuesLoadingError
);

// Template List
export const getTemplateList = createSelector(
  selectTemplateListState,
  fromTemplateListReducer.getTemplateList
);

export const getTemplateListLoading = createSelector(
  selectTemplateListState,
  fromTemplateListReducer.getTemplateListLoading
);

export const getTemplateListLoadingError = createSelector(
  selectTemplateListState,
  fromTemplateListReducer.getTemplateListLoadingError
);

export const getControlTypesLoaded = createSelector(
  selectControlTypesState,
  fromControlTypesReducer.getControlTypesLoaded
);

export const getControlTypesAsync = createSelector(
  selectControlTypesState,
  fromControlTypesReducer.getControlTypesAsync
);

export const getControlTypesLoading = createSelector(
  selectControlTypesState,
  fromControlTypesReducer.getControlTypesLoading
);

export const getControlTypes = createSelector(
  selectControlTypesState,
  fromControlTypesReducer.getControlTypes
);

export const getLatestControlTypes = createSelector(
  selectControlTypesState,
  fromControlTypesReducer.getLatestControlTypes
);

// Job Description Library
export const getBucketsAsync = createSelector(
  selectJobDescriptionLibraryState,
  fromJobDescriptionLibraryReducer.getBucketsAsync
);

export const getResultsAsync = createSelector(
  selectJobDescriptionLibraryState,
  fromJobDescriptionLibraryReducer.getResultsAsync
);

export const getLoadJobDescriptionLibraryError = createSelector(
  selectJobDescriptionLibraryState,
  fromJobDescriptionLibraryReducer.getLoadJobDescriptionLibraryError
);

// Workflow Template List
export const getWorkflowTemplateList = createSelector(
  selectSharedWorkflowState,
  fromSharedWorkflowReducer.getWorkflowTemplateList
);

export const getWorkflowSteps = createSelector(
  selectSharedWorkflowState,
  fromSharedWorkflowReducer.getWorkflowSteps
);

export const getWorkflowTemplateListNames = createSelector(
  selectSharedWorkflowState,
  fromSharedWorkflowReducer.getWorkflowTemplateListNames
);

export const getWorkflowTemplateListLoading = createSelector(
  selectSharedWorkflowState,
  fromSharedWorkflowReducer.getWorkflowTemplateListLoading
);

export const getWorkflowTemplateListSaving = createSelector(
  selectSharedWorkflowState,
  fromSharedWorkflowReducer.getWorkflowTemplateListSaving
);

export const getWorkflowTemplateListDeleting = createSelector(
  selectSharedWorkflowState,
  fromSharedWorkflowReducer.getWorkflowTemplateListDeleting
);

export const getWorkflowTemplateListError = createSelector(
  selectSharedWorkflowState,
  fromSharedWorkflowReducer.getWorkflowTemplateListError
);

export const getWorkflowTemplateListErrorMessage = createSelector(
  selectSharedWorkflowState,
  fromSharedWorkflowReducer.getWorkflowTemplateListErrorMessage
);

// Workflow Config
export const getWorkflowConfig = createSelector(
  selectSharedWorkflowState,
  fromSharedWorkflowReducer.getWorkflowConfig
);

export const getWorkflowHasUsersWithoutPermission = createSelector(
  selectSharedWorkflowState,
  fromSharedWorkflowReducer.getWorkflowHasUsersWithoutPermission
);

// Workflow User Rerouting
export const getNewUser = createSelector(
  selectSharedWorkflowState,
  fromSharedWorkflowReducer.getNewUser
);

export const getRerouting = createSelector(
  selectSharedWorkflowState,
  fromSharedWorkflowReducer.getRerouting
);

// Approval Workflow Config
export const getHasUsersWithoutPermission = createSelector(
  selectWorkflowConfigState,
  fromWorkflowConfigReducer.getHasUsersWithoutPermission
);

export const getWorkflowStepsFromWorkflowConfig = createSelector(
  selectWorkflowConfigState,
  fromWorkflowConfigReducer.getWorkflowStepsFromWorkflowConfig
);

export const getWorkflowConfigDirty = createSelector(
  selectWorkflowConfigState,
  fromWorkflowConfigReducer.getWorkflowConfigDirty
);

export const getWorkflowUserOrEmail = createSelector(
  selectWorkflowConfigState,
  fromWorkflowConfigReducer.getWorkflowUserOrEmail
);

// Collaboration Workflow Config
export const getSelectedCollaborationWorkflowUserOrEmail = createSelector(
  selectCollaborationWorkflowConfigState,
  fromCollaborationWorkflowConfigReducer.getSelectedCollaborationWorkflowUserOrEmail
);

export const getCollaborationWorkflowUsers = createSelector(
  selectCollaborationWorkflowConfigState,
  fromCollaborationWorkflowConfigReducer.getCollaborationWorkflowUsers
);
