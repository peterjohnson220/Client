import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromFooterViewListReducer from './footer-view.reducer';

// Feature area state
export interface JobDescriptionManagementSettingsFooterViewState {
    jdmFooterView: fromFooterViewListReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
    jobDescriptionManagement_settings_footerView: JobDescriptionManagementSettingsFooterViewState;
}

// Feature area reducers
export const reducers = {
    jdmFooterView : fromFooterViewListReducer.reducer,
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<JobDescriptionManagementSettingsFooterViewState>(
  'jobDescriptionManagement_settings_footerView');

// Feature Selectors
export const footerViewState = createSelector(
  selectFeatureAreaState,
  (state: JobDescriptionManagementSettingsFooterViewState) => state.jdmFooterView
);

export const getFooterViewObj =  createSelector(footerViewState, fromFooterViewListReducer.getJdmFooterViewObj);
export const getLoadingError =  createSelector(footerViewState, fromFooterViewListReducer.getLoadingError);
export const getSavingError =  createSelector(footerViewState, fromFooterViewListReducer.getSavingError);
export const getSavingSuccess =  createSelector(footerViewState, fromFooterViewListReducer.getSavingSuccess);
