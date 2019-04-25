import { NavigationLinkGroup } from 'libs/models/navigation';

import * as fromNavigationActions from '../actions';

export interface State {
  loading: boolean;
  loadingError: boolean;
  links: NavigationLinkGroup[];
}

const initialState: State = {
  loading: true,
  loadingError: false,
  links: []
};

export function reducer(state = initialState, action: fromNavigationActions.Actions): State {
  switch (action.type) {
    case fromNavigationActions.LOAD_NAVIGATION_LINKS:
      return {
        ...state,
        loading: true
      };
    case fromNavigationActions.LOAD_NAVIGATION_LINKS_SUCCESS:
      return {
        ...state,
        links: action.payload,
        loading: false
      };
    case fromNavigationActions.LOAD_NAVIGATION_LINKS_ERROR:
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    default:
      return state;
  }
}

export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getLinks = (state: State) => state.links;
