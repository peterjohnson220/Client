import * as headerActions from '../actions/header.actions';
import { NavigationLink } from '../../../models/';

export interface State {
  gettingDropdownNavigationLinks: boolean;
  gettingDropdownNavigationLinksError: boolean;
  dropdownNavigationLinks: NavigationLink[];
}

export const initialState: State = {
  gettingDropdownNavigationLinks: false,
  gettingDropdownNavigationLinksError: false,
  dropdownNavigationLinks: null
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
    default: {
      return state;
    }
  }
}

export const getGettingDropdownNavigationLinks = (state: State) => state.gettingDropdownNavigationLinks;
export const getGettingDropdownNavigationLinksError = (state: State) => state.gettingDropdownNavigationLinksError;
export const getDropdownNavigationLinks = (state: State) => state.dropdownNavigationLinks;
