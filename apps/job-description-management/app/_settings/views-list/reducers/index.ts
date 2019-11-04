import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromViewsListReducer from './views-list.reducer';
import * as fromUpsertViewModalReducer from './upsert-view-modal.reducer';

// Feature area state
export interface JobDescriptionManagementSettingsViewsListState {
  viewsList: fromViewsListReducer.State;
  upsertViewModal: fromUpsertViewModalReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  jobDescriptionManagement_settings_viewsList: JobDescriptionManagementSettingsViewsListState;
}

// Feature area reducers
export const reducers = {
  viewsList: fromViewsListReducer.reducer,
  upsertViewModal: fromUpsertViewModalReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<JobDescriptionManagementSettingsViewsListState>(
  'jobDescriptionManagement_settings_viewsList');

// Feature Selectors
export const selectViewsListState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSettingsViewsListState) => state.viewsList
);
export const selectUpsertViewModal = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSettingsViewsListState) => state.upsertViewModal
);

// Views List
export const getViewsListAsyncObj = createSelector(
  selectViewsListState,
  fromViewsListReducer.getViewsAsyncObj
);

// Upsert View Modal
export const getUpsertViewModalOpen = createSelector(
  selectUpsertViewModal,
  fromUpsertViewModalReducer.getUpsertViewModalOpen
);

export const getAvailableTemplatesAsyncObj = createSelector(
  selectUpsertViewModal,
  fromUpsertViewModalReducer.getAvailableTemplatesAsyncObj
);

export const getJobDescriptionViews = createSelector(
  selectUpsertViewModal,
  fromUpsertViewModalReducer.getJobDescriptionViews
);

export const getUpsertingView = createSelector(
  selectUpsertViewModal,
  fromUpsertViewModalReducer.getUpsertingView
);

export const getUpsertingViewError = createSelector(
  selectUpsertViewModal,
  fromUpsertViewModalReducer.getUpsertingViewError
);

export const getUpsertingViewErrorMessage = createSelector(
  selectUpsertViewModal,
  fromUpsertViewModalReducer.getUpsertingViewErrorMessage
);

export const getAssignedTemplateIds = createSelector(
  selectUpsertViewModal,
  fromUpsertViewModalReducer.getAssignedTemplateIds
);

export const getEditingViewName = createSelector(
  selectUpsertViewModal,
  fromUpsertViewModalReducer.getEditingViewName
);
