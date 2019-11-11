import * as fromCompanySelectorActions from '../actions/';
import { CompanySelectorItem } from '../models';

export interface State {
  isLoadingCompanies: boolean;
  hasLoadingCompaniesError: boolean;
  companies: CompanySelectorItem[];
  selectedCompany: CompanySelectorItem;
}

export const initialState: State = {
  isLoadingCompanies: false,
  hasLoadingCompaniesError: false,
  companies: null,
  selectedCompany: null
};

export function reducer(state = initialState, action: fromCompanySelectorActions.Actions): State {
  switch (action.type) {
    case fromCompanySelectorActions.GET_COMPANIES: {
      return {
        ...state,
        isLoadingCompanies: true,
        hasLoadingCompaniesError: false,
        selectedCompany: null
      };
    }
    case fromCompanySelectorActions.GET_COMPANIES_SUCCESS: {
      return {
        ...state,
        isLoadingCompanies: false,
        hasLoadingCompaniesError: false,
        companies: action.payload
      };
    }
    case fromCompanySelectorActions.GET_COMPANIES_ERROR: {
      return {
        ...state,
        isLoadingCompanies: false,
        hasLoadingCompaniesError: true,
        selectedCompany: null
      };
    }
    case fromCompanySelectorActions.SET_SELECTED_COMPANY: {
      return {
        ...state,
        selectedCompany: action.payload
      };

    }
    default:
      return state;
  }
}

export const getIsLoadingCompanies = (state: State) => state.isLoadingCompanies;
export const getHasFetchCompaniesError = (state: State) => state.hasLoadingCompaniesError;
export const getCompanies = (state: State) => state.companies;
export const getSelectedCompany = (state: State) => state.selectedCompany;
