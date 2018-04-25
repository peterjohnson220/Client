import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromRoot from '../../../state/state';

import * as fromHeaderReducer from './header.reducer';
import * as fromLeftSidebarReducer from './left-sidebar.reducer';

export interface LayoutWrapperState {
  header: fromHeaderReducer.State;
  leftSidebar: fromLeftSidebarReducer.State;
}

export interface State extends fromRoot.State {
  layoutWrapper: LayoutWrapperState;
}

export const reducers = {
  header: fromHeaderReducer.reducer,
  leftSidebar: fromLeftSidebarReducer.reducer
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

export const getGettingHomePageLink = createSelector(
  selectHeaderState,
  fromHeaderReducer.getGettingHomePageLink
);

export const getHomePageLink = createSelector(
  selectHeaderState,
  fromHeaderReducer.getHomePageLink
);

export const getGettingHomePageLinkError = createSelector(
  selectHeaderState,
  fromHeaderReducer.getGettingHomePageLinkError
);

export const selectLeftSidebarState = createSelector(
  selectLayoutWrapperState,
  (state: LayoutWrapperState) => state.leftSidebar
);

export const getGettingLeftSidebarNavigationLinks = createSelector(
  selectLeftSidebarState,
  fromLeftSidebarReducer.getGettingLeftSidebarNavigationLinks
);

export const getLeftSidebarNavigationLinks = createSelector(
  selectLeftSidebarState,
  fromLeftSidebarReducer.getLeftSidebarNavigationLinks
);

export const getGettingLeftSidebarNavigationLinksError = createSelector(
  selectLeftSidebarState,
  fromLeftSidebarReducer.getGettingLeftSidebarNavigationLinksError
);

export const getLoadedLeftSidebarNavigationLinksError = createSelector(
  selectLeftSidebarState,
  fromLeftSidebarReducer.getLoadedLeftSidebarNavigationLinks
);
