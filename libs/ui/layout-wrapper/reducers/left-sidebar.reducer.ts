import * as leftSidebarActions from '../actions/left-sidebar.actions';
import { SidebarLink } from '../../../models/';

export interface State {
  gettingLeftSidebarNavigationLinks: boolean;
  gettingLeftSidebarNavigationLinksError: boolean;
  leftSidebarNavigationLinks: SidebarLink[];
  loadedLeftSidebarNavigationLinks: boolean;
}

export const initialState: State = {
  gettingLeftSidebarNavigationLinks: false,
  gettingLeftSidebarNavigationLinksError: false,
  leftSidebarNavigationLinks: null,
  loadedLeftSidebarNavigationLinks: false
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
      return {
        ...state,
        gettingLeftSidebarNavigationLinks: false,
        leftSidebarNavigationLinks: action.payload,
        loadedLeftSidebarNavigationLinks: true
      };
    }
    case leftSidebarActions.GET_LEFT_SIDEBAR_NAVIGATION_LINKS_ERROR: {
      return {
        ...state,
        gettingLeftSidebarNavigationLinks: false,
        gettingLeftSidebarNavigationLinksError: true,
        loadedLeftSidebarNavigationLinks: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getGettingLeftSidebarNavigationLinks = (state: State) => state.gettingLeftSidebarNavigationLinks;
export const getGettingLeftSidebarNavigationLinksError = (state: State) => state.gettingLeftSidebarNavigationLinksError;
export const getLeftSidebarNavigationLinks = (state: State) => state.leftSidebarNavigationLinks;
export const getLoadedLeftSidebarNavigationLinks = (state: State) => state.loadedLeftSidebarNavigationLinks;
