import { CompanyTilesResponse } from 'libs/models/payfactors-api';

import * as fromCompanySelectorActions from '../actions';
import { CompanySelectorItem } from '../models';
import { IsValidCompanyRepository } from '../actions';

export interface State {
  isLoadingCompanies: boolean;
  hasLoadingCompaniesError: boolean;
  companies: CompanySelectorItem[];
  selectedCompany: CompanySelectorItem;
  companyHasBenefits: boolean;
  isValidCompanyRepository: boolean;
}

export const initialState: State = {
  isLoadingCompanies: false,
  hasLoadingCompaniesError: false,
  companies: null,
  selectedCompany: null,
  companyHasBenefits: null,
  isValidCompanyRepository: null
};

export function reducer(state = initialState, action: fromCompanySelectorActions.Actions): State {
  switch (action.type) {
    case fromCompanySelectorActions.GET_COMPANIES: {
      return {
        ...state,
        isLoadingCompanies: true,
        hasLoadingCompaniesError: false,
        selectedCompany: null,
        companyHasBenefits: null
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
        selectedCompany: null,
        companyHasBenefits: false
      };
    }
    case fromCompanySelectorActions.SET_SELECTED_COMPANY: {
      return {
        ...state,
        selectedCompany: action.payload
      };

    }
    case fromCompanySelectorActions.COMPANY_HAS_BENEFITS_SUCCESS: {
      return {
        ...state,
        companyHasBenefits: action.companyHasBenefits
      };
    }
    case fromCompanySelectorActions.COMPANY_HAS_BENEFITS: {
      return {
        ...state,
        companyHasBenefits: null
      };
    }
    case fromCompanySelectorActions.IS_VALID_COMPANY_REPOSITORY: {
      return {
        ...state,
        isValidCompanyRepository: null
      };
    }
    case fromCompanySelectorActions.IS_VALID_COMPANY_REPOSITORY_SUCCESS: {
      return {
        ...state,
        isValidCompanyRepository: action.isValidCompanyRepository
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
export const companyHasBenefits = (state: State) => state.companyHasBenefits;
export const isValidCompanyRepository = (state: State) => state.isValidCompanyRepository;
