import { CompanySelectorItem } from 'libs/features/company/company-selector/models';

import * as fromCompanySelectorActions from '../actions/company-selector.actions';

export interface State {
  getCompanies: boolean;
  getCompaniesError: boolean;
  companies: CompanySelectorItem[];
}

export const initialState: State = {
  getCompanies: false,
  getCompaniesError: false,
  companies: null
};

export function reducer(state = initialState, action: fromCompanySelectorActions.Actions): State {
  switch (action.type) {
    case fromCompanySelectorActions.GET_COMPANIES: {
      return {
        ...state,
        getCompanies: true,
        getCompaniesError: false
      };
    }
    case fromCompanySelectorActions.GET_COMPANIES_SUCCESS: {
      return {
        ...state,
        getCompanies: false,
        getCompaniesError: false,
        companies: action.payload
      };
    }
    case fromCompanySelectorActions.GET_COMPANIES_ERROR: {
      return {
        ...state,
        getCompanies: false,
        getCompaniesError: true
      };
    }
    default:
      return state;
  }
}

export const getGettingCompanies = (state: State) => state.getCompanies;
export const getGettingCompaniesError = (state: State) => state.getCompaniesError;
export const getCompanies = (state: State) => state.companies;
