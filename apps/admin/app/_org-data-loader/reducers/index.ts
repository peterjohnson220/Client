import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromCompanySelectorReducer from './company-selector.reducer';
import * as fromOrgDataFieldMappingsReducer from './org-data-field-mappings.reducer';

// Feature area state
export interface OrgDataLoaderState {
  companySelector: fromCompanySelectorReducer.State;
  orgDataFieldMappings: fromOrgDataFieldMappingsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  orgDataLoader: OrgDataLoaderState;
}

// Feature area reducers
export const reducers = {
  companySelector: fromCompanySelectorReducer.reducer,
  orgDataFieldMappings: fromOrgDataFieldMappingsReducer.reducer
};


// Select Feature Area
export const selectorgDataAutoloaderState = createFeatureSelector<OrgDataLoaderState>('orgDataLoader');

// Feature Selectors
export const selectCompanySelectorState =
  createSelector(selectorgDataAutoloaderState, (state: OrgDataLoaderState) => state.companySelector);
export const selectOrgDataFieldMappingsState =
  createSelector(selectorgDataAutoloaderState, (state: OrgDataLoaderState) => state.orgDataFieldMappings);

export const {
  selectAll: getCompanies
} = fromCompanySelectorReducer.adapter.getSelectors(selectCompanySelectorState);

export const getCompaniesLoading =
  createSelector(selectCompanySelectorState, fromCompanySelectorReducer.getLoadingCompanies);
export const getCompaniesLoadingError =
  createSelector(selectCompanySelectorState, fromCompanySelectorReducer.getLoadingCompaniesError);

export const getSavingFieldMappings =
  createSelector(selectOrgDataFieldMappingsState, fromOrgDataFieldMappingsReducer.getSavingFieldMappings);
export const getSavingFieldMappingsError =
  createSelector(selectOrgDataFieldMappingsState, fromOrgDataFieldMappingsReducer.getSavingFieldMappingsError);
export const getSavingFieldMappingsSuccess =
  createSelector(selectOrgDataFieldMappingsState, fromOrgDataFieldMappingsReducer.getSavingFieldMappingsSuccess);
