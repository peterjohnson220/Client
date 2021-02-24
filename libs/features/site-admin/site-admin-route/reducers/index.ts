import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromSiteAdminRouteReducer from './site-admin-route.reducers';

// Feature area state
export interface SiteAdminRouteFeatureState {
  siteAdminRoute: fromSiteAdminRouteReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_siteAdminRoute: SiteAdminRouteFeatureState;
}

// Feature area reducers
export const reducers = {
  siteAdminRoute: fromSiteAdminRouteReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<SiteAdminRouteFeatureState>('feature_siteAdminRoute');

// Feature Selectors
export const siteAdminRouteState = createSelector(
  selectFeatureAreaState,
  (state: SiteAdminRouteFeatureState) => state.siteAdminRoute
);

// App Notifications Selectors
export const getRepositoriesByRoute = createSelector(siteAdminRouteState, fromSiteAdminRouteReducer.getRepositoriesByRoute);
