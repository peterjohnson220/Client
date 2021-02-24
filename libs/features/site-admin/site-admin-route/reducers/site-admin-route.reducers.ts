import * as fromSiteAdminRouteActions from '../actions/site-admin-route.actions';

export interface State {
  repositoriesByRoute: any;
  repositoriesByRouteError: boolean;
}

export const initialState: State = {
  repositoriesByRoute: null,
  repositoriesByRouteError: false
};

export function reducer(state = initialState, action: fromSiteAdminRouteActions.Actions): State {
  switch (action.type) {
    case fromSiteAdminRouteActions.GET_REPOSITORIES_BY_ROUTE: {
      return {
        ...state,
        repositoriesByRoute: null,
        repositoriesByRouteError: false
      };
    }
    case fromSiteAdminRouteActions.GET_REPOSITORIES_BY_ROUTE_SUCCESS: {
      return {
        ...state,
        repositoriesByRoute: action.payload,
        repositoriesByRouteError: false
      };
    }
    case fromSiteAdminRouteActions.GET_REPOSITORIES_BY_ROUTE_ERROR: {
      return {
        ...state,
        repositoriesByRoute: null,
        repositoriesByRouteError: true
      };
    }
    default:
      return state;
  }
}

export const getRepositoriesByRoute = (state: State) => state.repositoriesByRoute;
export const getRepositoriesByRouteError = (state: State) => state.repositoriesByRouteError;
