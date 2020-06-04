import {createFeatureSelector, createSelector} from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromTemplateListReducer from './template-list.reducer';

// Feature area state
export interface JobDescriptionManagementTemplateListState {
  templateList: fromTemplateListReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  jobDescriptionManagement_template: JobDescriptionManagementTemplateListState;
}

// Feature area reducers
export const reducers = {
  templateList: fromTemplateListReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<JobDescriptionManagementTemplateListState>(
  'jobDescriptionManagement_jobDescriptionTemplateList');

// Feature Selectors
export const selectTemplateListState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementTemplateListState) => state.templateList
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

export const getTemplateListError = createSelector(
  selectTemplateListState,
  fromTemplateListReducer.getTemplateListError
);

export const getTemplateListLoadingErrorMessage = createSelector(
  selectTemplateListState,
  fromTemplateListReducer.getTemplateListErrorMessage
);

export const getTemplateDeleting = createSelector(
  selectTemplateListState,
  fromTemplateListReducer.getTemplateDeleting
);
