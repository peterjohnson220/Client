import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromNavigationReducer from './navigation.redcuer';

// Feature area state
export interface NavigationState {
    navigation: fromNavigationReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
    navigation: NavigationState;
}

// Feature area reducers
export const reducers = {
    navigation: fromNavigationReducer.reducer,
};

// Select Feature area
export const selectPfAdminNavigationState = createFeatureSelector<NavigationState>('pf-admin_navigation');

// Navigation view Selectors
export const selectNavigationState =
    createSelector(selectPfAdminNavigationState, (state: NavigationState) => state.navigation);

export const getLinks =
    createSelector( selectNavigationState, fromNavigationReducer.getLinks);
export const getNavigationLinksLoading =
    createSelector( selectNavigationState, fromNavigationReducer.getLoading);
export const getNavigationLinksLoadingError =
    createSelector( selectNavigationState, fromNavigationReducer.getLoadingError);
