import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromViewEditReducer from './view-edit.reducer';
import * as fromJobInfoViewEditorReducer from './job-info-view-editor.reducer';

// Feature area state
export interface JobDescriptionManagementSettingsViewEditState {
  viewEdit: fromViewEditReducer.State;
  jobInfoViewEditor: fromJobInfoViewEditorReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  jobDescriptionManagement_settings_viewEdit: JobDescriptionManagementSettingsViewEditState;
}

// Feature area reducers
export const reducers = {
  viewEdit: fromViewEditReducer.reducer,
  jobInfoViewEditor: fromJobInfoViewEditorReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<JobDescriptionManagementSettingsViewEditState>(
  'jobDescriptionManagement_settings_viewEdit');

// Feature Selectors
export const selectViewEditState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSettingsViewEditState) => state.viewEdit
);

export const selectJobInfoViewEditorState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSettingsViewEditState) => state.jobInfoViewEditor
);

// Edit View
export const getViewEditViewName = createSelector(
  selectViewEditState,
  fromViewEditReducer.getViewName
);

export const getViewEditTemplateViewsAsyncObj = createSelector(
  selectViewEditState,
  fromViewEditReducer.getTemplateViewsAsyncObj
);

export const getViewEditSaving = createSelector(
  selectViewEditState,
  fromViewEditReducer.getSaving
);

export const getViewEditSavingError = createSelector(
  selectViewEditState,
  fromViewEditReducer.getSavingError
);

// Job Info View Editor
export const getJobInfoFieldsAsyncObj = createSelector(
  selectJobInfoViewEditorState,
  fromJobInfoViewEditorReducer.getJobInfoFieldsAsyncObj
);
