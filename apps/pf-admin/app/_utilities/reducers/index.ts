import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromSelectCompanyReducer from './select-company.reducer';
import * as fromDefaultScopesPageReducer from './yoy-default-scopes-page.reducer';
import * as fromJobDescriptionLoaderReducer from './job-description-loader.reducer';
import * as fromYoyDefaultScopesCompaniesListReducer from './yoy-default-scopes-companies-list.reducer';
// Feature area state
export interface UtilitiesState {
  selectCompany: fromSelectCompanyReducer.State;
  defaultScopesPage: fromDefaultScopesPageReducer.State;
  jobDescriptionLoader: fromJobDescriptionLoaderReducer.State;
  yoyDefaultScopesCompaniesList: fromYoyDefaultScopesCompaniesListReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  utilities: UtilitiesState;
}

// Feature area reducers
export const reducers = {
  selectCompany: fromSelectCompanyReducer.reducer,
  defaultScopesPage: fromDefaultScopesPageReducer.reducer,
  jobDescriptionLoader: fromJobDescriptionLoaderReducer.reducer,
  yoyDefaultScopesCompaniesList: fromYoyDefaultScopesCompaniesListReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<UtilitiesState>('pf-admin_utilities');

// Feature Selectors
export const selectSelectCompanyState = createSelector(
  selectFeatureAreaState,
  (state: UtilitiesState) => state.selectCompany
);

export const selectDefaultScopesPage = createSelector(
  selectFeatureAreaState,
  (state: UtilitiesState) => state.defaultScopesPage
);

export const selectJobDescriptionLoaderState = createSelector(
  selectFeatureAreaState,
  (state: UtilitiesState) => state.jobDescriptionLoader
);

export const selectYoyDefaultScopesCompaniesListState = createSelector(
  selectFeatureAreaState,
  (state: UtilitiesState) => state.yoyDefaultScopesCompaniesList
);

// Select Company
export const getLoadingCompaniesList = createSelector(
  selectSelectCompanyState,
  fromSelectCompanyReducer.getLoadingCompaniesList
);

export const getCompaniesList = createSelector(
  selectSelectCompanyState,
  fromSelectCompanyReducer.getCompaniesList
);

export const getLoadingCompaniesListError = createSelector(
  selectSelectCompanyState,
  fromSelectCompanyReducer.getLoadingCompaniesListError
);

export const getCompanyFilter = createSelector(
  selectSelectCompanyState,
  fromSelectCompanyReducer.getCompanyFilter
);


// Default Scopes Page
export const getCompany = createSelector(
  selectDefaultScopesPage,
  fromDefaultScopesPageReducer.getCompany
);

export const getLoadingCompany = createSelector(
  selectDefaultScopesPage,
  fromDefaultScopesPageReducer.getLoadingCompany
);

export const getLoadingCompanyError = createSelector(
  selectDefaultScopesPage,
  fromDefaultScopesPageReducer.getLoadingCompanyError
);

export const getDefaultScopeSurveys = createSelector(
  selectDefaultScopesPage,
  fromDefaultScopesPageReducer.getDefaultScopeSurveys
);

export const getSelectedDefaultScopeSurvey = createSelector(
  selectDefaultScopesPage,
  fromDefaultScopesPageReducer.getSelectedDefaultScopeSurvey
);

export const getLoadingDefaultScopeSurveys = createSelector(
  selectDefaultScopesPage,
  fromDefaultScopesPageReducer.getLoadingDefaultScopeSurveys
);

export const getLoadingDefaultScopeSurveysError = createSelector(
  selectDefaultScopesPage,
  fromDefaultScopesPageReducer.getLoadingDefaultScopeSurveysError
);

export const getMatchResultsAsync = createSelector(
  selectDefaultScopesPage,
  fromDefaultScopesPageReducer.getMatchResultsAsync
);

export const getSelectedMatchResult = createSelector(
  selectDefaultScopesPage,
  fromDefaultScopesPageReducer.getSelectedMatchResult
);

export const getFilteredMatchResults = createSelector(
  selectDefaultScopesPage,
  fromDefaultScopesPageReducer.getFilteredMatchResults
);

export const getSurveyScopesAsync = createSelector(
  selectDefaultScopesPage,
  fromDefaultScopesPageReducer.getSurveyScopesAsync
);

export const getSelectedScope = createSelector(
  selectDefaultScopesPage,
  fromDefaultScopesPageReducer.getSelectedScope
);

// Job Description Loader
export const getValidated = createSelector(
  selectJobDescriptionLoaderState,
  fromJobDescriptionLoaderReducer.getValidated
);

export const getValidating = createSelector(
  selectJobDescriptionLoaderState,
  fromJobDescriptionLoaderReducer.getValidating
);

export const getValidationResults = createSelector(
  selectJobDescriptionLoaderState,
  fromJobDescriptionLoaderReducer.getValidationResults
);

export const getImported = createSelector(
  selectJobDescriptionLoaderState,
  fromJobDescriptionLoaderReducer.getImported
);

export const getImporting = createSelector(
  selectJobDescriptionLoaderState,
  fromJobDescriptionLoaderReducer.getImporting
);

export const getImportingResults = createSelector(
  selectJobDescriptionLoaderState,
  fromJobDescriptionLoaderReducer.getImportingResults
);

export const getJobDescriptionLoaderCompany = createSelector(
  selectJobDescriptionLoaderState,
  fromJobDescriptionLoaderReducer.getJobDescriptionLoaderCompany
);

export const getDeletingJobDescriptions = createSelector(
  selectJobDescriptionLoaderState,
  fromJobDescriptionLoaderReducer.getDeletingJobDescriptions
);

export const getDeletingJobDescriptionsError = createSelector(
  selectJobDescriptionLoaderState,
  fromJobDescriptionLoaderReducer.getDeletingJobDescriptionsError
);

// Yoy Default Scopes Companies List
export const getYoyDefaultScopesCompaniesLoaded = createSelector(
  selectYoyDefaultScopesCompaniesListState,
  fromYoyDefaultScopesCompaniesListReducer.getLoaded
);

export const getYoyDefaultScopesCompaniesLoading = createSelector(
  selectYoyDefaultScopesCompaniesListState,
  fromYoyDefaultScopesCompaniesListReducer.getLoading
);

export const getYoyDefaultScopesCompanies = createSelector(
  selectYoyDefaultScopesCompaniesListState,
  fromYoyDefaultScopesCompaniesListReducer.getYoyDefaultScopesCompanies
);
