import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromJobDescriptionAppliesToReducer from './job_description-appliesto.reducer';
import * as fromTemplateListReducer from './template-list.reducer';

// Feature area state
export interface JobDescriptionManagementSharedState {
  jobDescriptionAppliesTo: fromJobDescriptionAppliesToReducer.State;
  templateList: fromTemplateListReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  jobDescriptionManagement_shared: JobDescriptionManagementSharedState;
}

// Feature area reducers
export const reducers = {
  jobDescriptionAppliesTo: fromJobDescriptionAppliesToReducer.reducer,
  templateList: fromTemplateListReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<JobDescriptionManagementSharedState>(
  'jobDescriptionManagement_shared');

// Feature Selectors
export const selectJobDescriptionAppliesToState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSharedState) => state.jobDescriptionAppliesTo
);

export const selectTemplateListState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSharedState) => state.templateList
);

// Job Description Applies To
export const getAppliesToAttributesExist = createSelector(
  selectJobDescriptionAppliesToState,
  fromJobDescriptionAppliesToReducer.getAppliesToAttributesExist
);

export const getAppliesToAttributesExistGetting = createSelector(
  selectJobDescriptionAppliesToState,
  fromJobDescriptionAppliesToReducer.getAppliesToAttributesExistGetting
);

export const getAppliesToAttributesExistGettingError = createSelector(
  selectJobDescriptionAppliesToState,
  fromJobDescriptionAppliesToReducer.getAppliesToAttributesExistGettingError
);

export const getJobDescriptionAppliesToItems = createSelector(
  selectJobDescriptionAppliesToState,
  fromJobDescriptionAppliesToReducer.getJobDescriptionAppliesToItems
);

export const getJobDescriptionAppliesToLoading = createSelector(
  selectJobDescriptionAppliesToState,
  fromJobDescriptionAppliesToReducer.getJobDescriptionAppliesToLoading
);

export const getJobDescriptionAppliesToLoadingError = createSelector(
  selectJobDescriptionAppliesToState,
  fromJobDescriptionAppliesToReducer.getJobDescriptionAppliesToLoadingError
);

export const getJobDescriptionAppliesToValues = createSelector(
  selectJobDescriptionAppliesToState,
  fromJobDescriptionAppliesToReducer.getJobDescriptionAppliesToValues
);

export const getJobDescriptionAppliesToValuesLoading = createSelector(
  selectJobDescriptionAppliesToState,
  fromJobDescriptionAppliesToReducer.getJobDescriptionAppliesToValuesLoading
);

export const getJobDescriptionAppliesToValuesLoadingError = createSelector(
  selectJobDescriptionAppliesToState,
  fromJobDescriptionAppliesToReducer.getJobDescriptionAppliesToValuesLoadingError
);

// Template List
export const getTemplateList = createSelector(
  selectTemplateListState,
  fromTemplateListReducer.getTemplateList
);

export const getTemplateListLoading = createSelector(
  selectTemplateListState,
  fromTemplateListReducer.getTemplateListLoading
);

export const getTemplateListLoadingError = createSelector(
  selectTemplateListState,
  fromTemplateListReducer.getTemplateListLoadingError
);
