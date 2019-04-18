import * as fromCompaniesActions from '../actions/companies.actions';

import { CompanyGridItem } from '../models';

export interface State {
  loading: boolean;
  loadingError: boolean;
  entities: CompanyGridItem[];
  searchTerm: string;
  gridSkipAmount: number;
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  entities: [],
  searchTerm: null,
  gridSkipAmount: 0,
};

export function reducer(state = initialState, action: fromCompaniesActions.Actions): State {
  switch (action.type) {
    case fromCompaniesActions.LOAD_COMPANIES:
      return {
        ...state,
        loading: true
      };
    case fromCompaniesActions.LOAD_COMPANIES_ERROR:
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    case fromCompaniesActions.LOAD_COMPANIES_SUCCESS:
      return {
        ...state,
        loading: false,
        entities: action.payload
      };
    case fromCompaniesActions.UPDATE_SEARCH_TERM:
        return {
          ...state,
          searchTerm: action.payload
        };
    default:
      return state;
  }
}

export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getCompanies = (state: State) => state.entities;
export const getSearchTerm = (state: State) => state.searchTerm;
