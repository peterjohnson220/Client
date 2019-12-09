import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromWorkflowListReducer from './routing-workflows-list.reducer';
import * as fromWorkflowDeleteReducer from './routing-workflows-delete.reducer';
import * as fromWorkflowUpsertReducer from './routing-workflows-upsert.reducer';

// Feature area state
export interface JobDescriptionManagementSettingsRoutingWorkflowsListState {
    templateList: fromWorkflowListReducer.State;
    deleteModal: fromWorkflowDeleteReducer.State;
    upsertModal: fromWorkflowUpsertReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
    jobDescriptionManagement_settings_routingWorkflowsList: JobDescriptionManagementSettingsRoutingWorkflowsListState;
}

// Feature area reducers
export const reducers = {
    templateList: fromWorkflowListReducer.reducer,
    deleteModal: fromWorkflowDeleteReducer.reducer,
    upsertModal: fromWorkflowUpsertReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<JobDescriptionManagementSettingsRoutingWorkflowsListState>(
  'jobDescriptionManagement_settings_routingWorkflowsList');

// Feature Selectors
export const selectRoutingWorkflowsListState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSettingsRoutingWorkflowsListState) => state.templateList
);

export const selectDeleteModal = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSettingsRoutingWorkflowsListState) => state.deleteModal
);

export const selectUpsertModal = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSettingsRoutingWorkflowsListState) => state.upsertModal
);

// Company Controls List
export const getWorkflowTemplateList = createSelector(
    selectRoutingWorkflowsListState,
    fromWorkflowListReducer.getWorkflowTemplateList
);

export const getWorkflowTemplateNames = createSelector(
    selectRoutingWorkflowsListState,
    fromWorkflowListReducer.getWorkflowTemplateNames
);

// Delete Modal
export const getDeleting = createSelector(
    selectDeleteModal,
    fromWorkflowDeleteReducer.getDeleting
);

export const getDeletingSuccess = createSelector(
    selectDeleteModal,
    fromWorkflowDeleteReducer.getDeletingSuccess
);

export const getDeletingError = createSelector(
    selectDeleteModal,
    fromWorkflowDeleteReducer.getDeletingError
);

export const getDeletingErrorMsg = createSelector(
    selectDeleteModal,
    fromWorkflowDeleteReducer.getDeletingErrorMessage
);

export const getDeleteModalOpen = createSelector(
    selectDeleteModal,
    fromWorkflowDeleteReducer.getDeleteModalOpen
);

export const getTemplateToBeDeleted = createSelector(
    selectDeleteModal,
    fromWorkflowDeleteReducer.getTemplateToBeDeleted
);

// Upsert Modal
export const getUpsertModalOpen = createSelector(
    selectUpsertModal,
    fromWorkflowUpsertReducer.getUpsertModalOpen
);

export const getTemplateBeingEdited = createSelector(
    selectUpsertModal,
    fromWorkflowUpsertReducer.getTemplateBeingEdited
);

export const getTemplateSaveObj = createSelector(
    selectUpsertModal,
    fromWorkflowUpsertReducer.getTemplateSaveObj
);

export const getWorkflowTemplateSaving = createSelector(
    selectUpsertModal,
    fromWorkflowUpsertReducer.getSaving
);

export const getWorkflowTemplateSavingSuccess = createSelector(
    selectUpsertModal,
    fromWorkflowUpsertReducer.getSavingSuccess
);

export const getWorkflowTemplateSavingError = createSelector(
    selectUpsertModal,
    fromWorkflowUpsertReducer.getSavingError
);

export const getWorkflowTemplateSavingErrorMessage = createSelector(
    selectUpsertModal,
    fromWorkflowUpsertReducer.getSavingErrorMessage
);

