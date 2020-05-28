import {createFeatureSelector, createSelector} from '@ngrx/store';

import * as fromRoot from 'libs/state/state';

import * as fromCompanyDescriptionReducer from './company-detail.reducer';

export interface CompanyDescriptionFeatureState {
  companyDescription: fromCompanyDescriptionReducer.State;
}
export interface State extends fromRoot.State {
  feature_companydetail: CompanyDescriptionFeatureState;
}

// Feature area reducers
export const reducers = {
  companyDescription: fromCompanyDescriptionReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<CompanyDescriptionFeatureState>('feature_companydetail');

// Feature Selectors
export const selectCompanyDescriptionState = createSelector(
  selectFeatureAreaState,
  (state: CompanyDescriptionFeatureState) => state.companyDescription
);

// App Notifications Selectors
export const getCompanyDescription = createSelector(selectCompanyDescriptionState, fromCompanyDescriptionReducer.getCompanyDescription);
export const getCompanyDescriptionLoading = createSelector(selectCompanyDescriptionState, fromCompanyDescriptionReducer.getIsLoadingCompanyDescription);
export const getSubsidiaryDescription = createSelector(selectCompanyDescriptionState, fromCompanyDescriptionReducer.getSubsidiaryDescription);
export const getSubsidiaryDescriptionLoading = createSelector(selectCompanyDescriptionState, fromCompanyDescriptionReducer.getIsLoadingSubsidiaryDescription);
