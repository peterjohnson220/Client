import { CompanyDto } from 'libs/models/company';

import * as fromJobsPageActions from '../actions/jobs-page.actions';

export interface State {
  company: CompanyDto;
  companyLoading: boolean;
  companyLoadingError: boolean;
  // TODO: Expand with collection of company jobs etc.
}

export const initialState: State = {
  company: null,
  companyLoading: false,
  companyLoadingError: false
};

export function reducer(state = initialState, action: fromJobsPageActions.JobsPageActions): State {
  switch (action.type) {
    case fromJobsPageActions.LOAD_COMPANY: {
      return {
        ...state,
        companyLoading: true,
        companyLoadingError: false
      };
    }
    case fromJobsPageActions.LOAD_COMPANY_SUCCESS: {
      return {
        ...state,
        company: action.payload,
        companyLoading: false,
        companyLoadingError: false
      };
    }
    case fromJobsPageActions.LOAD_COMPANY_ERROR: {
      return {
        ...state,
        companyLoading: false,
        companyLoadingError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getCompany = (state: State) => state.company;
export const getCompanyLoading = (state: State) => state.companyLoading;
export const getCompanyLoadingError = (state: State) => state.companyLoadingError;







