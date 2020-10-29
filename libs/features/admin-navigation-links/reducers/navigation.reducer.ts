
import * as fromNavigationActions from '../actions/navigation.actions';
import { NavigationLinkGroup } from 'libs/models/navigation';

export interface State {
  loading: boolean;
  loadingError: boolean;
  adminLinks: NavigationLinkGroup[];
}

const initialState: State = {
  loading: true,
  loadingError: false,
  adminLinks: [],
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
      adminLinks: action.payload.adminLinks,
      loading: false
    };
    case fromNavigationActions.LOAD_NAVIGATION_LINKS_ERROR:
    return {
      ...state,
      loading: false,
      loadingError: true
    };
    default: {
      return state;
    }
  }
}

export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getAdminLinks = (state: State) => state.adminLinks;
