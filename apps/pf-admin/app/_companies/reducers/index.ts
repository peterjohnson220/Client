import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromCompaniesReducer from './companies.reducer';
import * as fromCompaniesGridReducer from './companies-grid.reducer';
import * as fromCompanyPageReducer from './company-page.reducer';
import * as fromCompanyNotesReducer from './company-notes.reducer';

export interface CompanyManagementState {
  companies: fromCompaniesReducer.State;
  grid: fromCompaniesGridReducer.GridState;
  companyPage: fromCompanyPageReducer.State;
  notes: fromCompanyNotesReducer.State;
}

export interface State extends fromRoot.State {
    companies: CompanyManagementState;
}

export const reducers = {
  companies: fromCompaniesReducer.reducer,
  grid: fromCompaniesGridReducer.reducer,
  companyPage: fromCompanyPageReducer.reducer,
  notes: fromCompanyNotesReducer.reducer
};

// Select Feature area
export const selectFeatureAreaState = createFeatureSelector<CompanyManagementState>('pf-admin_companies');

// Feature selectors
export const selectCompanyPageState = createSelector(
  selectFeatureAreaState,
  (state: CompanyManagementState) => state.companyPage
);

// Companies Page State
export const selectCompaniesState =
    createSelector(selectFeatureAreaState, (state: CompanyManagementState) => state.companies);

export const getCompanies =
    createSelector( selectCompaniesState, fromCompaniesReducer.getCompanies);

export const getCompaniesLoading =
    createSelector( selectCompaniesState, fromCompaniesReducer.getLoading);

export const getCompaniesLoadingError =
    createSelector( selectCompaniesState, fromCompaniesReducer.getLoadingError);

export const getSearchTerm =
    createSelector( selectCompaniesState, fromCompaniesReducer.getSearchTerm);

// Companies Grid State
export const selectCompaniesGridState =
    createSelector(selectFeatureAreaState, (state: CompanyManagementState) => state.grid);
export const getGridSkipAmount =
    createSelector( selectCompaniesGridState, fromCompaniesGridReducer.getSkipAmount);
export const getState =
    createSelector( selectCompaniesGridState, fromCompaniesGridReducer.getState);
export const getGridTakeAmount =
    createSelector(selectCompaniesGridState, fromCompaniesGridReducer.getTakeAmount);

// Company Page
export const getLoadingPublicTokenUrl = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getLoadingPublicTokenUrl
);

export const getLoadingPublicTokenUrlError = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getLoadingPublicTokenUrlError
);

export const getTokenUrl = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getTokenUrl
);

export const getLoadingSystemUserGroups = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getLoadingSystemUserGroups
);

export const getSystemUserGroups = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getSystemUserGroups
);

export const getLoadingPfServicesReps = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getLoadingPfServicesReps
);

export const getPfServicesReps = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getPfServicesReps
);

export const getPfJdmSrAssociates = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getPfJdmSrAssociates
);

export const getLoadingPfCustomerSuccessManagers = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getLoadingPfCustomerSuccessManagers
);

export const getPfCustomerSuccessManagers = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getPfCustomerSuccessManagers
);

export const getLoadingCompanyIndustries = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getLoadingCompanyIndustries
);

export const getCompanyIndustries = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getCompanyIndustries
);

export const getLoadingCompanyTiles = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getLoadingCompanyTiles
);

export const getLoadingCompanyTilesSuccess = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getLoadingCompanyTilesSuccess
);

export const getLoadingCompanyTilesError = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getLoadingCompanyTilesError
);

export const getCompanyTiles = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getCompanyTiles
);

export const getSelectedCompanyTiles = createSelector(
  getCompanyTiles, tiles => {
    return tiles.filter(x => x.Checked).map(t => t.TileId);
  }
);

export const getSelectedCompanyMarketingTiles = createSelector(
  getCompanyTiles, tiles => {
    return tiles.filter(x => x.MarketingEnabled).map(t => t.TileId);
  }
);

export const getLoadingCompanySettings = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getLoadingCompanySettings
);

export const getLoadingCompanySettingsSuccess = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getLoadingCompanySettingsSuccess
);

export const getLoadingCompanySettingsError = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getLoadingCompanySettingsError
);

export const getCompanySettings = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getCompanySettings
);

export const getLoadingCompanyDataSets = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getLoadingCompanyDataSets
);

export const getLoadingCompanyDataSetsError = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getLoadingCompanyDataSetsError
);

export const getCompanyDataSets = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getCompanyDataSets
);

export const getSelectedDataSets = createSelector(
  getCompanyDataSets, dataSets => {
    return dataSets.filter(x => x.Checked).map(ds => ds.CountryCode);
  }
);

export const getLoadingCompanyClientTypes = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getLoadingCompanyClientTypes
);

export const getCompanyClientTypes = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getCompanyClientTypes
);

export const getLoadingCompositeFields = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getLoadingCompositeFields
);

export const getCompositeFields = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getCompositeFields
);

export const getSavingCompany = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getSavingCompany
);

export const getSavingCompanyError = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getSavingCompanyError
);

export const getCompanyDataSetsEnabled = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getCompanyDataSetsEnabled
);

export const getLoadingCompany = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getLoadingCompany
);

export const getCompany = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getCompany
);

export const getJobPricingLimitInfo = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getJobPricingLimitInfo
);

export const getEnableJobPricingLimiter = createSelector(
  selectCompanyPageState,
  fromCompanyPageReducer.getEnableJobPricingLimiter
);

// Notes
export const selectCompanyNotesState = createSelector(
  selectFeatureAreaState,
  (state: CompanyManagementState) => state.notes
);

export const getCompanyNotes =
    createSelector( selectCompanyNotesState, fromCompanyNotesReducer.getNotes);
