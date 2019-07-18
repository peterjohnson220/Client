import * as fromYoyDefaultScopesCompaniesListActions from '../actions/yoy-default-scopes-companies-list.actions';
import { CompanyGridItem } from '../../_companies/models';

export interface State {
  loaded: boolean;
  loading: boolean;
  entities: CompanyGridItem[];
}

const initialState: State = {
  loaded: false,
  loading: false,
  entities: []
};
export function reducer(state = initialState, action: fromYoyDefaultScopesCompaniesListActions.Actions): State {
  switch (action.type) {
    case fromYoyDefaultScopesCompaniesListActions.LOAD_YOY_DEFAULT_SCOPES_COMPANIES_LIST:
      return {
        ...state,
        loading: true
      };
    case fromYoyDefaultScopesCompaniesListActions.LOAD_YOY_DEFAULT_SCOPES_COMPANIES_LIST_SUCCESS:
      return {
        ...state,
        loaded: true,
        loading: false,
        entities: action.payload
      };
    default:
      return state;
  }
}

export const getLoaded = (state: State) => state.loaded;
export const getLoading = (state: State) => state.loading;
export const getYoyDefaultScopesCompanies = (state: State) => state.entities;
