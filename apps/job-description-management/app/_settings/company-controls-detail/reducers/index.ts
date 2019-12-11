import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromCompanyControlsReducer from './company-controls-detail.reducers';

// Feature area state
export interface JobDescriptionManagementSettingsCompanyControlsDetailState {
  companyControlDetail: fromCompanyControlsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
    jobDescriptionManagement_settings_companyControlDetail: JobDescriptionManagementSettingsCompanyControlsDetailState;
}

// Feature area reducers
export const reducers = {
    companyControlDetail: fromCompanyControlsReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<JobDescriptionManagementSettingsCompanyControlsDetailState>(
  'jobDescriptionManagement_settings_companyControlDetail');

// Feature Selectors
export const selectCompanyControlDetailState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSettingsCompanyControlsDetailState) => state.companyControlDetail
);

// Company Controls Detail
export const getControlBeingViewed = createSelector(
    selectCompanyControlDetailState,
  fromCompanyControlsReducer.getControlBeingViewed
);

export const getControlEditableInfo = createSelector(
    selectCompanyControlDetailState,
  fromCompanyControlsReducer.getControlEditableInfo
);

export const getReadonly = createSelector(
    selectCompanyControlDetailState,
  fromCompanyControlsReducer.getReadonly
);

export const getLoading = createSelector(
    selectCompanyControlDetailState,
  fromCompanyControlsReducer.getLoading
);

export const getSaving = createSelector(
    selectCompanyControlDetailState,
  fromCompanyControlsReducer.getSaving
);

export const getSavingError = createSelector(
    selectCompanyControlDetailState,
  fromCompanyControlsReducer.getSavingError
);

export const getSavingErrorMessage = createSelector(
    selectCompanyControlDetailState,
  fromCompanyControlsReducer.getSavingErrorMessage
);

export const getUnhandledrror = createSelector(
    selectCompanyControlDetailState,
  fromCompanyControlsReducer.getUnhandledrror
);
