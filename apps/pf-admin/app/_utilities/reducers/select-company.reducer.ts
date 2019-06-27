import * as fromSelectCompanyActions from '../actions/select-company.actions';
import { DataListItem } from '../models';

export interface State {
  loadingCompaniesList: boolean;
  loadingCompaniesListError: boolean;
  companiesList: DataListItem[];
  companyFilter: string;
}

const initialState: State = {
  loadingCompaniesList: false,
  loadingCompaniesListError: false,
  companiesList: [],
  companyFilter: ''
};

export function reducer(state = initialState, action: fromSelectCompanyActions.Actions): State {
  switch (action.type) {
    case fromSelectCompanyActions.LOAD_COMPANIES_LIST:
      return {
        ...state,
        loadingCompaniesList: true
      };
    case fromSelectCompanyActions.LOAD_COMPANIES_LIST_SUCCESS:
      return {
        ...state,
        companiesList: action.payload,
        loadingCompaniesList: false
      };
    case fromSelectCompanyActions.LOAD_COMPANIES_LIST_ERROR:
      return {
        ...state,
        loadingCompaniesList: false,
        loadingCompaniesListError: true
      };
    case fromSelectCompanyActions.SET_COMPANY_FILTER:
      return {
        ...state,
        companyFilter: action.payload
      };
    default:
      return state;
  }
}

export const getLoadingCompaniesList = (state: State) => state.loadingCompaniesList;
export const getLoadingCompaniesListError = (state: State) => state.loadingCompaniesListError;
export const getCompaniesList = (state: State) => state.companiesList;
export const getCompanyFilter = (state: State) => state.companyFilter;
