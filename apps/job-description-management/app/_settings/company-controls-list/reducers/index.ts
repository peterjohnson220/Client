import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromCompanyControlsListReducer from './company-controls-list.reducer';
import * as fromCompanyControlsCreateReducer from './company-controls-create.reducer';
import * as fromCompanyControlsDeleteReducer from './company-controls-delete.reducer';

// Feature area state
export interface JobDescriptionManagementSettingsCompanyControlsListState {
  companyControls: fromCompanyControlsListReducer.State;
  createModal: fromCompanyControlsCreateReducer.State;
  deleteModal: fromCompanyControlsDeleteReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
    jobDescriptionManagement_settings_companyControlsList: JobDescriptionManagementSettingsCompanyControlsListState;
}

// Feature area reducers
export const reducers = {
  companyControls: fromCompanyControlsListReducer.reducer,
  createModal: fromCompanyControlsCreateReducer.reducer,
  deleteModal: fromCompanyControlsDeleteReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<JobDescriptionManagementSettingsCompanyControlsListState>(
  'jobDescriptionManagement_settings_companyControlsList');

// Feature Selectors
export const selectCompanyControlsListState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSettingsCompanyControlsListState) => state.companyControls
);
export const selectCreateControlModal = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSettingsCompanyControlsListState) => state.createModal
);
export const selectDeleteControlModal = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSettingsCompanyControlsListState) => state.deleteModal
);

// Company Controls List
export const getAvailableComapnyControls = createSelector(
    selectCompanyControlsListState,
  fromCompanyControlsListReducer.getAvailableCompanyControls
);

// Create Modal
export const getCreateContrlModalOpen = createSelector(
  selectCreateControlModal,
  fromCompanyControlsCreateReducer.getCreateControlModalOpen
);

export const getCreatingControl = createSelector(
  selectCreateControlModal,
  fromCompanyControlsCreateReducer.getCreatingControl
);

export const getCreatingControlError = createSelector(
  selectCreateControlModal,
  fromCompanyControlsCreateReducer.getCreatingControlError
);

export const getCreatingControlErrorMessage = createSelector(
  selectCreateControlModal,
  fromCompanyControlsCreateReducer.getCreatingControlErrorMessage
);

// Delete Modal
export const getDeletingControlSuccess = createSelector(
  selectDeleteControlModal,
  fromCompanyControlsDeleteReducer.getDeletingControlSuccess
);

export const getDeletingControlError = createSelector(
  selectDeleteControlModal,
  fromCompanyControlsDeleteReducer.getDeletingControlError
);

export const getDeletingControlErrorMessage = createSelector(
  selectDeleteControlModal,
  fromCompanyControlsDeleteReducer.getDeletingControlErrorMessage
);

export const getTemplateWithControlType = createSelector(
  selectDeleteControlModal,
  fromCompanyControlsDeleteReducer.getTemplateWithControlType
);


