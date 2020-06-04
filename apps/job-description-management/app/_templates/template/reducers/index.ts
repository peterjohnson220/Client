import {createFeatureSelector, createSelector} from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromTemplateReducer from './template.reducer';
import * as fromCompanyJobsWithNoTemplateReducer from './company-jobs-with-no-template.reducer';
import * as fromCompanyJobsWithTemplateReducer from './company-jobs-with-template.reducer';
import * as fromSaveJobAssignmentReducer from './company-job-assignment-save.reducer';
import * as fromAvailableJobInfoFieldReducer from './available-job-information-fields.reducer';
import * as fromTemplateSettingReducer from './template-settings.reducer';

// Feature area state
export interface JobDescriptionManagementTemplateState {
  template: fromTemplateReducer.State;
  companyJobsWithNoTemplate: fromCompanyJobsWithNoTemplateReducer.State;
  companyJobsWithTemplate: fromCompanyJobsWithTemplateReducer.State;
  saveJobAssignment: fromSaveJobAssignmentReducer.State;
  availableJobInfoField: fromAvailableJobInfoFieldReducer.State;
  templateSetting: fromTemplateSettingReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  jobDescriptionManagement_template: JobDescriptionManagementTemplateState;
}

// Feature area reducers
export const reducers = {
  template: fromTemplateReducer.reducer,
  companyJobsWithNoTemplate: fromCompanyJobsWithNoTemplateReducer.reducer,
  companyJobsWithTemplate: fromCompanyJobsWithTemplateReducer.reducer,
  saveJobAssignment: fromSaveJobAssignmentReducer.reducer,
  availableJobInfoField: fromAvailableJobInfoFieldReducer.reducer,
  templateSetting: fromTemplateSettingReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<JobDescriptionManagementTemplateState>(
  'jobDescriptionManagement_jobDescriptionTemplate');

// Feature Selectors

export const selectTemplateState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementTemplateState) => state.template
);

export const selectCompanyJobsWithNoTemplateState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementTemplateState) => state.companyJobsWithNoTemplate
);

export const selectCompanyJobsWithTemplateState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementTemplateState) => state.companyJobsWithTemplate
);

export const selectSaveJobAssignmentState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementTemplateState) => state.saveJobAssignment
);

export const selectAvailableJobInfoFieldState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementTemplateState) => state.availableJobInfoField
);

export const selectTemplateSettingState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementTemplateState) => state.templateSetting
);

// Template Setting

export const getTemplateSettingLoading = createSelector(
  selectTemplateSettingState,
  fromTemplateSettingReducer.getLoading
);

export const getTemplateSettingLoadingError = createSelector(
  selectTemplateSettingState,
  fromTemplateSettingReducer.getLoadingError
);

export const getTemplateSettingLoadingErrorMessage = createSelector(
  selectTemplateSettingState,
  fromTemplateSettingReducer.getLoadingErrorMessage
);

export const getTemplateSettingSaving = createSelector(
  selectTemplateSettingState,
  fromTemplateSettingReducer.getSaving
);

export const getTemplateSettingSavingError = createSelector(
  selectTemplateSettingState,
  fromTemplateSettingReducer.getSavingError
);

export const getTemplateSettings = createSelector(
  selectTemplateSettingState,
  fromTemplateSettingReducer.getTemplateSettings
);

// Template State
export const getTemplate = createSelector(
  selectTemplateState,
  fromTemplateReducer.getTemplate
);

export const getTemplateLoading = createSelector(
  selectTemplateState,
  fromTemplateReducer.getTemplateLoading
);

export const getTemplateError = createSelector(
  selectTemplateState,
  fromTemplateReducer.getTemplateError
);

export const getTemplateErrorMessage = createSelector(
  selectTemplateState,
  fromTemplateReducer.getTemplateErrorMessage
);

export const getErrorMessage = createSelector(
  selectTemplateState,
  fromTemplateReducer.getErrorMessage
);

export const getTemplateAssignmentSummary = createSelector(
  selectTemplateState,
  fromTemplateReducer.getTemplateAssignmentSummary
);

export const getTemplateEditing = createSelector(
  selectTemplateState,
  fromTemplateReducer.getTemplateEditing
);

export const getTemplateSaving = createSelector(
  selectTemplateState,
  fromTemplateReducer.getTemplateSaving
);

export const getTemplatePublishing = createSelector(
  selectTemplateState,
  fromTemplateReducer.getTemplatePublishing
);

export const getTemplateCopying = createSelector(
  selectTemplateState,
  fromTemplateReducer.getTemplateCopying
);

export const getTemplateSaveError = createSelector(
  selectTemplateState,
  fromTemplateReducer.getTemplateSaveError
);

export const getTemplateAssigningError = createSelector(
  selectTemplateState,
  fromTemplateReducer.getTemplateAssigningError
);


// Company Jobs with No Template

export const getCompanyJobsWithNoTemplate = createSelector(
  selectCompanyJobsWithNoTemplateState,
  fromCompanyJobsWithNoTemplateReducer.getCompanyJobsWithNoTemplate
);

export const getCompanyJobsWithNoTemplateLoading = createSelector(
  selectCompanyJobsWithNoTemplateState,
  fromCompanyJobsWithNoTemplateReducer.getLoading
);

export const getSelectedCompanyJobsWithNoTemplate = createSelector(
  selectCompanyJobsWithNoTemplateState,
  fromCompanyJobsWithNoTemplateReducer.getSelected
);

export const getCompanyJobsWithNoTemplateError = createSelector(
  selectCompanyJobsWithNoTemplateState,
  fromCompanyJobsWithNoTemplateReducer.getError
);

export const getCompanyJobsWithNoTemplateErrorMessage = createSelector(
  selectCompanyJobsWithNoTemplateState,
  fromCompanyJobsWithNoTemplateReducer.getErrorMessage
);

// Company Jobs with Template

export const getCompanyJobsWithTemplate = createSelector(
  selectCompanyJobsWithTemplateState,
  fromCompanyJobsWithTemplateReducer.getCompanyJobsWithTemplate
);

export const getCompanyJobsWithTemplateLoading = createSelector(
  selectCompanyJobsWithTemplateState,
  fromCompanyJobsWithTemplateReducer.getLoading
);

export const getSelectedCompanyJobsWithTemplate = createSelector(
  selectCompanyJobsWithTemplateState,
  fromCompanyJobsWithTemplateReducer.getSelected
);

export const getCompanyJobsWithTemplateError = createSelector(
  selectCompanyJobsWithTemplateState,
  fromCompanyJobsWithTemplateReducer.getError
);

export const getCompanyJobsWithTemplateErrorMessage = createSelector(
  selectCompanyJobsWithTemplateState,
  fromCompanyJobsWithTemplateReducer.getErrorMessage
);

// Save Job Assignment

export const getJobAssignmentSaving = createSelector(
  selectSaveJobAssignmentState,
  fromSaveJobAssignmentReducer.getSaving
);

export const getJobAssignmentSavingSuccess = createSelector(
  selectSaveJobAssignmentState,
  fromSaveJobAssignmentReducer.getSavingSuccess
);

export const getJobAssignmentSavingError = createSelector(
  selectSaveJobAssignmentState,
  fromSaveJobAssignmentReducer.getSavingError
);

export const getJobAssignmentSavingErrorMessage = createSelector(
  selectSaveJobAssignmentState,
  fromSaveJobAssignmentReducer.getSavingErrorMessage
);

// Available Job Information Field

export const getAvailableJobInfoFieldLoading = createSelector(
  selectAvailableJobInfoFieldState,
  fromAvailableJobInfoFieldReducer.getLoading
);

export const getAvailableJobInfoFields = createSelector(
  selectAvailableJobInfoFieldState,
  fromAvailableJobInfoFieldReducer.getAvailableJobInformationFields
);
