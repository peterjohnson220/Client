import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromCompanySelectorReducer from './company-selector.reducer';

// Feature area state
export interface CompanySelectorFeatureState {
    companySelector: fromCompanySelectorReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
    feature_companyselector: CompanySelectorFeatureState;
}

// Feature area reducers
export const reducers = {
    companySelector: fromCompanySelectorReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<CompanySelectorFeatureState>('feature_companyselector');

// Feature Selectors
export const selectCompanySelectorState = createSelector(
    selectFeatureAreaState,
    (state: CompanySelectorFeatureState) => state.companySelector
);

// App Notifications Selectors
export const getCompanies = createSelector(selectCompanySelectorState, fromCompanySelectorReducer.getCompanies);
export const getCompaniesLoading = createSelector(selectCompanySelectorState, fromCompanySelectorReducer.getIsLoadingCompanies);
export const getSelectedCompany = createSelector(selectCompanySelectorState, fromCompanySelectorReducer.getSelectedCompany);
export const companyHasBenefits = createSelector(selectCompanySelectorState, fromCompanySelectorReducer.companyHasBenefits);
