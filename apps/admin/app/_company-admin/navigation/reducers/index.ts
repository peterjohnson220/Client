import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromNavigationReducer from './navigation.reducer';

// Feature area state
export interface CompanyAdminNavigationState {
  navigation: fromNavigationReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  companyAdminNavigation: CompanyAdminNavigationState;
}

// Feature area reducers
export const reducers = {
  navigation: fromNavigationReducer.reducer,
};

// Select Feature Area
export const selectCompanyAdminNavigationState =
  createFeatureSelector<CompanyAdminNavigationState>('companyAdminNavigation');

// View Selectors
export const selectNavigationState =
  createSelector(selectCompanyAdminNavigationState, (state: CompanyAdminNavigationState) => state.navigation);

// Navigation Links
export const getLinks = createSelector(
  selectNavigationState, fromNavigationReducer.getLinks
);

export const getNavigationLinksLoading = createSelector(
  selectNavigationState, fromNavigationReducer.getLoading
);

export const getNavigationLinksLoadingError = createSelector(
  selectNavigationState, fromNavigationReducer.getLoadingError
);

