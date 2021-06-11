import { convertToFaIconFormat } from 'libs/core/functions';

import * as leftSidebarActions from '../actions/left-sidebar.actions';
import { SidebarLink } from '../../../models/';

export interface State {
  gettingLeftSidebarNavigationLinks: boolean;
  gettingLeftSidebarNavigationLinksError: boolean;
  leftSidebarNavigationLinks: SidebarLink[];
  loadedLeftSidebarNavigationLinks: boolean;
  isOpen: boolean;
}

export const initialState: State = {
  gettingLeftSidebarNavigationLinks: false,
  gettingLeftSidebarNavigationLinksError: false,
  leftSidebarNavigationLinks: null,
  loadedLeftSidebarNavigationLinks: false,
  isOpen: false
};

export function reducer(state = initialState, action: leftSidebarActions.Actions): State {
  switch (action.type) {
    case leftSidebarActions.GET_LEFT_SIDEBAR_NAVIGATION_LINKS: {
      return {
        ...state,
        gettingLeftSidebarNavigationLinks: true,
        gettingLeftSidebarNavigationLinksError: false,
        leftSidebarNavigationLinks: null,
        loadedLeftSidebarNavigationLinks: false
      };
    }
    case leftSidebarActions.GET_LEFT_SIDEBAR_NAVIGATION_LINKS_SUCCESS: {
      return saveNavigationLinks(state, action.payload);
    }
    case leftSidebarActions.GET_LEFT_SIDEBAR_NAVIGATION_LINKS_ERROR: {
      return {
        ...state,
        gettingLeftSidebarNavigationLinks: false,
        gettingLeftSidebarNavigationLinksError: true,
        loadedLeftSidebarNavigationLinks: false
      };
    }
    case leftSidebarActions.TOGGLE_LEFT_SIDEBAR: {
      return {
        ...state,
        isOpen: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

export function saveNavigationLinks(state: State, navigationLinks: SidebarLink[]): State {
  const sidebarLinks = navigationLinks.map((l: SidebarLink) => (<SidebarLink>{
    ...l,
    FaIconClass: convertToFaIconFormat(l.IconClassNew)
  }));

  return {
    ...state,
    gettingLeftSidebarNavigationLinks: false,
    leftSidebarNavigationLinks: sidebarLinks,
    loadedLeftSidebarNavigationLinks: true
  };
}

export const getGettingLeftSidebarNavigationLinks = (state: State) => state.gettingLeftSidebarNavigationLinks;
export const getGettingLeftSidebarNavigationLinksError = (state: State) => state.gettingLeftSidebarNavigationLinksError;
export const getLeftSidebarNavigationLinks = (state: State) => state.leftSidebarNavigationLinks;
export const getLoadedLeftSidebarNavigationLinks = (state: State) => state.loadedLeftSidebarNavigationLinks;
export const getLeftSidebarOpen = (state: State) => state.isOpen;
