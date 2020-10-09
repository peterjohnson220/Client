import { createFeatureSelector, createSelector } from '@ngrx/store';


// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromNavigationLinksReducer from './navigation.reducer';

// Feature area state
export interface NavigationLinksState {
  navigationLinks: fromNavigationLinksReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  navigation_links: NavigationLinksState;
}

// Feature area reducers
export const reducers = {
  navigationLinks: fromNavigationLinksReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<NavigationLinksState>('feature_NavigationLinks');

// Feature Selectors
export const selectNavigationLinkState = createSelector(
  selectFeatureAreaState,
  (state: NavigationLinksState) => state.navigationLinks
);

// Navigation Links Selectors
export const getNavigationLinksLoading = createSelector(selectNavigationLinkState, fromNavigationLinksReducer.getLoading);
export const getNavigationLinksLoadingError = createSelector(selectNavigationLinkState, fromNavigationLinksReducer.getLoadingError);
export const getAdminLinks = createSelector(selectNavigationLinkState, fromNavigationLinksReducer.getAdminLinks);
