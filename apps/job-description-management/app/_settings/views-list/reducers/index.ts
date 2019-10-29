import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromViewsListReducer from './views-list.reducer';

// Feature area state
export interface JobDescriptionManagementSettingsViewListState {
  viewsList: fromViewsListReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  jobDescriptionManagement_settings_viewList: JobDescriptionManagementSettingsViewListState;
}

// Feature area reducers
export const reducers = {
  viewsList: fromViewsListReducer.reducer,
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<JobDescriptionManagementSettingsViewListState>(
  'jobDescriptionManagement_settings_viewList');

// Feature Selectors
export const selectViewsListState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSettingsViewListState) => state.viewsList
);

// Views List
export const getViewsListAsyncObj = createSelector(
  selectViewsListState,
  fromViewsListReducer.getViewsAsyncObj
);
