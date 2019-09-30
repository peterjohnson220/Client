import {createFeatureSelector, createSelector} from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromTemplateListReducer from './template-list.reducer';
import * as fromTemplateReducer from './template.reducer';

// Feature area state
export interface JobDescriptionManagementTemplateState {
  templateList: fromTemplateListReducer.State;
  template: fromTemplateReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  jobDescriptionManagement_template: JobDescriptionManagementTemplateState;
}

// Feature area reducers
export const reducers = {
  templateList: fromTemplateListReducer.reducer,
  template: fromTemplateReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<JobDescriptionManagementTemplateState>(
  'jobDescriptionManagement_jobDescriptionTemplates');

// Feature Selectors
export const selectTemplateListState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementTemplateState) => state.templateList
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
