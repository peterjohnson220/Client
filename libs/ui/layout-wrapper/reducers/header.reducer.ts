import * as headerActions from '../actions/header.actions';
import { NavigationLink, HomePageLink } from '../../../models/';

export interface State {
  gettingDropdownNavigationLinks: boolean;
  gettingDropdownNavigationLinksError: boolean;
  dropdownNavigationLinks: NavigationLink[];
  gettingHomePageLink: boolean;
  gettingHomePageLinkError: boolean;
  homePageLink: HomePageLink;
}

export const initialState: State = {
  gettingDropdownNavigationLinks: false,
  gettingDropdownNavigationLinksError: false,
  dropdownNavigationLinks: null,
  gettingHomePageLink: false,
  gettingHomePageLinkError: false,
  homePageLink: null
};

export function reducer(state = initialState, action: headerActions.Actions): State {
  switch (action.type) {
    case headerActions.GET_HEADER_DROPDOWN_NAVIGATION_LINKS: {
      return {
        ...state,
        gettingDropdownNavigationLinks: true,
        gettingDropdownNavigationLinksError: false,
        dropdownNavigationLinks: null
      };
    }
    case headerActions.GET_HEADER_DROPDOWN_NAVIGATION_LINKS_SUCCESS: {
      return {
        ...state,
        gettingDropdownNavigationLinks: false,
        dropdownNavigationLinks: action.payload
      };
    }
    case headerActions.GET_HEADER_DROPDOWN_NAVIGATION_LINKS_ERROR: {
      return {
        ...state,
        gettingDropdownNavigationLinks: false,
        gettingDropdownNavigationLinksError: true
      };
    }
    case headerActions.GET_SSO_HEADER_DROPDOWN_NAVIGATION_LINKS: {
      return {
        ...state,
        gettingDropdownNavigationLinks: true,
        gettingDropdownNavigationLinksError: false,
        dropdownNavigationLinks: null
      };
    }
    case headerActions.GET_SSO_HEADER_DROPDOWN_NAVIGATION_LINKS_SUCCESS: {
      return {
        ...state,
        gettingDropdownNavigationLinks: false,
        dropdownNavigationLinks: action.payload
      };
    }
    case headerActions.GET_SSO_HEADER_DROPDOWN_NAVIGATION_LINKS_ERROR: {
      return {
        ...state,
        gettingDropdownNavigationLinks: false,
        gettingDropdownNavigationLinksError: true
      };
    }
    case headerActions.GET_HEADER_USER_HOMEPAGE_LINK: {
      return {
        ...state,
        gettingHomePageLink: true,
        gettingHomePageLinkError: false,
        homePageLink: null
      };
    }
    case headerActions.GET_HEADER_USER_HOMEPAGE_LINK_SUCCESS: {
      return {
        ...state,
        gettingHomePageLink: false,
        homePageLink: action.payload
      };
    }
    case headerActions.GET_HEADER_USER_HOMEPAGE_LINK_ERROR: {
      return {
        ...state,
        gettingHomePageLink: false,
        gettingHomePageLinkError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getGettingDropdownNavigationLinks = (state: State) => state.gettingDropdownNavigationLinks;
export const getGettingDropdownNavigationLinksError = (state: State) => state.gettingDropdownNavigationLinksError;
export const getDropdownNavigationLinks = (state: State) => state.dropdownNavigationLinks;
export const getGettingHomePageLink = (state: State) => state.gettingHomePageLink;
export const getGettingHomePageLinkError = (state: State) => state.gettingHomePageLinkError;
export const getHomePageLink = (state: State) => state.homePageLink;
