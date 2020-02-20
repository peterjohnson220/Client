import {createFeatureSelector, createSelector} from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromTemplateListReducer from './template-list.reducer';
import * as fromTemplateReducer from './template.reducer';
import * as fromCompanyJobsWithNoTemplateReducer from './company-jobs-with-no-template.reducer';
import * as fromCompanyJobsWithTemplateReducer from './company-jobs-with-template.reducer';
import * as fromSaveJobAssignmentReducer from './company-job-assignment-save.reducer';

// Feature area state
export interface JobDescriptionManagementTemplateState {
  templateList: fromTemplateListReducer.State;
  template: fromTemplateReducer.State;
  companyJobsWithNoTemplate: fromCompanyJobsWithNoTemplateReducer.State;
  companyJobsWithTemplate: fromCompanyJobsWithTemplateReducer.State;
  saveJobAssignment: fromSaveJobAssignmentReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  jobDescriptionManagement_template: JobDescriptionManagementTemplateState;
}

// Feature area reducers
export const reducers = {
  templateList: fromTemplateListReducer.reducer,
  template: fromTemplateReducer.reducer,
  companyJobsWithNoTemplate: fromCompanyJobsWithNoTemplateReducer.reducer,
  companyJobsWithTemplate: fromCompanyJobsWithTemplateReducer.reducer,
  saveJobAssignment: fromSaveJobAssignmentReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<JobDescriptionManagementTemplateState>(
  'jobDescriptionManagement_jobDescriptionTemplates');

// Feature Selectors
export const selectTemplateListState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementTemplateState) => state.templateList
);

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


// Template List page
export const getTemplatesList = createSelector(
  selectTemplateListState,
  fromTemplateListReducer.getTemplateList
);

export const getTemplateListLoading = createSelector(
  selectTemplateListState,
  fromTemplateListReducer.getTemplateListLoading
);

export const getTemplateListLoaded = createSelector(
  selectTemplateListState,
  fromTemplateListReducer.getTemplateListLoaded
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

export const getTemplateLoadingError = createSelector(
  selectTemplateState,
  fromTemplateReducer.getTemplateLoadingError
);

export const getErrorMessage = createSelector(
  selectTemplateState,
  fromTemplateReducer.getErrorMessage
);

export const getTemplateAssignmentSummary = createSelector(
  selectTemplateState,
  fromTemplateReducer.getTemplateAssignmentSummary
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
