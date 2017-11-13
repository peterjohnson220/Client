import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromRoot from '../../../app-state/app-state';

import * as fromHeaderReducer from './header.reducer';

export interface LayoutWrapperState {
  header: fromHeaderReducer.State;
}

export interface State extends fromRoot.AppState {
  layoutWrapper: LayoutWrapperState;
}

export const reducers = {
  header: fromHeaderReducer.reducer
};

export const selectLayoutWrapperState = createFeatureSelector<LayoutWrapperState>('layoutWrapper');


export const selectHeaderState = createSelector(
  selectLayoutWrapperState,
  (state: LayoutWrapperState) => state.header
);

export const getGettingHeaderDropdownNavigationLinks = createSelector(
  selectHeaderState,
  fromHeaderReducer.getGettingDropdownNavigationLinks
);

export const getHeaderDropdownNavigationLinks = createSelector(
  selectHeaderState,
  fromHeaderReducer.getDropdownNavigationLinks
);

export const getGettingHeaderDropdownNavigationLinksError = createSelector(
  selectHeaderState,
  fromHeaderReducer.getGettingDropdownNavigationLinksError
);

