import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromCompaniesReducer from './companies.reducer';
import * as fromCompaniesGridReducer from './companies-grid.reducer';

export interface CompanyManagementState {
    companies: fromCompaniesReducer.State;
    grid: fromCompaniesGridReducer.GridState;
}

export interface State extends fromRoot.State {
    pfadmin_companies: CompanyManagementState;
}

export const reducers = {
    companies: fromCompaniesReducer.reducer,
    grid: fromCompaniesGridReducer.reducer,
};

// Select Feature area
export const selectFeatureAreaState = createFeatureSelector<CompanyManagementState>('pfadmin_companies');

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
