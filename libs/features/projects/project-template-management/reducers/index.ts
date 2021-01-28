import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromProjectTemplateManagementReducer from './project-template-management.reducer';

// Feature area state
export interface ProjectTemplateManagementState {
  projectTemplateManagement: fromProjectTemplateManagementReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_project_template_management: ProjectTemplateManagementState;
}

// Feature area reducers
export const reducers = {
  projectTemplateManagement: fromProjectTemplateManagementReducer.reducer
};

// Select Feature Area
export const selectProjectTemplateManagementFeature =
  createFeatureSelector<ProjectTemplateManagementState>('feature_project_template_management');

// View Selectors
export const selectProjectTemplateState =
  createSelector(selectProjectTemplateManagementFeature, (state: ProjectTemplateManagementState) => state.projectTemplateManagement);

// Template Form
export const getShowProjectTemplateForm = createSelector(selectProjectTemplateState, fromProjectTemplateManagementReducer.getShowProjectTemplateForm);
export const getSaving = createSelector(selectProjectTemplateState, fromProjectTemplateManagementReducer.getSavingProjectTemplate);
export const getErrorMessage = createSelector(selectProjectTemplateState, fromProjectTemplateManagementReducer.getErrorMessage);
export const getTemplateFieldsAsync = createSelector(selectProjectTemplateState, fromProjectTemplateManagementReducer.getTemplateFieldsAsync);
export const getProjectTemplateId = createSelector(selectProjectTemplateState, fromProjectTemplateManagementReducer.getProjectTemplateId);
