import * as companyContextActions from '../actions/company-context.actions';

import { CompanyDto } from '../../../models/';

export interface State {
  gettingCompanyContext: boolean;
  gettingCompanyContextError: boolean;
  companyContext: CompanyDto;
}

export const initialState: State = {
  gettingCompanyContext: false,
  gettingCompanyContextError: false,
  companyContext: null
};

export function reducer(state = initialState, action: companyContextActions.Actions): State {
  switch (action.type) {
    case companyContextActions.GET_COMPANY_CONTEXT: {
      return {
        ...state,
        gettingCompanyContext: true,
        gettingCompanyContextError: false,
        companyContext: null
      };
    }
    case companyContextActions.GET_COMPANY_CONTEXT_SUCCESS: {
      return {
        ...state,
        gettingCompanyContext: false,
        companyContext: action.payload
      };
    }
    case companyContextActions.GET_COMPANY_CONTEXT_ERROR: {
      return {
        ...state,
        gettingCompanyContext: false,
        gettingCompanyContextError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getGettingCompanyContext = (state: State) => state.gettingCompanyContext;
export const getGettingCompanyContextError = (state: State) => state.gettingCompanyContextError;
export const getCompanyContext = (state: State) => state.companyContext;
