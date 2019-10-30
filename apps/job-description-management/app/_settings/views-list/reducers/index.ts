import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromViewsListReducer from './views-list.reducer';

// Feature area state
export interface JobDescriptionManagementSettingsViewsListState {
  viewsList: fromViewsListReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  jobDescriptionManagement_settings_viewsList: JobDescriptionManagementSettingsViewsListState;
}

// Feature area reducers
export const reducers = {
  viewsList: fromViewsListReducer.reducer,
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<JobDescriptionManagementSettingsViewsListState>(
  'jobDescriptionManagement_settings_viewsList');

// Feature Selectors
export const selectViewsListState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSettingsViewsListState) => state.viewsList
);

// Views List
export const getViewsListAsyncObj = createSelector(
  selectViewsListState,
  fromViewsListReducer.getViewsAsyncObj
);
