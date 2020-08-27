import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj, CompanyDto } from 'libs/models';

import * as fromActions from '../actions';
import { CompanyLogo } from '../models';

export interface State {
    company: CompanyDto;
    companyLogoAsync: AsyncStateObj<string>;
    loading: boolean;
    error: boolean;
    errorMessage: string;
    logos: CompanyLogo[];
}

export const initialState: State = {
    company: null,
    companyLogoAsync: generateDefaultAsyncStateObj<string>(null),
    loading: false,
    error: false,
    errorMessage: '',
    logos: []
};

export function reducer(state = initialState, action: fromActions.CompanyLogoActions): State {
  switch (action.type) {
    case fromActions.LOAD_COMPANY_LOGO: {
      const companyLogoAsync = cloneDeep(state.companyLogoAsync);
      companyLogoAsync.loading = true;
      companyLogoAsync.loadingError = false;
      return {
        ...state,
        companyLogoAsync: companyLogoAsync,
        company: null
      };
    }
    case fromActions.LOAD_COMPANY_LOGO_ERROR: {
      const companyLogoAsync: AsyncStateObj<string> = cloneDeep(state.companyLogoAsync);
      companyLogoAsync.loading = false;
      companyLogoAsync.loadingError = true;
      return {
        ...state,
        companyLogoAsync: companyLogoAsync,
        company: null
      };
    }
    case fromActions.LOAD_COMPANY_LOGO_SUCCESS: {
      const companyLogoAsync: AsyncStateObj<string> = cloneDeep(state.companyLogoAsync);
      companyLogoAsync.loading = false;
      companyLogoAsync.obj = action.payload.CompanyLogo;
      return {
        ...state,
        companyLogoAsync: companyLogoAsync,
        company: action.payload
      };
    }
    case fromActions.LOAD_AVAILABLE_COMPANY_LOGOS: {
        return {
          ...state,
          loading: true
         };
    }
    case fromActions.LOAD_AVAILABLE_COMPANY_LOGOS_SUCCESS: {
       return {
        ...state,
        loading: false,
        logos: action.payload,
        error: false,
        errorMessage: ''
        };
    }
    case fromActions.LOAD_AVAILABLE_COMPANY_LOGOS_ERROR: {
       return {
        ...state,
        loading: false,
        logos: [],
        error: true,
        errorMessage: action.payload.error
        };
    }
    default:
      return state;
  }
}

export const getCompanyLogoAsync = (state: State) => state.companyLogoAsync;
export const getCompany = (state: State) => state.company;
export const getCompanyLogos = (state: State) => state.logos;
export const getCompanyLogosLoading = (state: State) => state.loading;
export const getCompanyLogosLoadingError = (state: State) => state.error;
export const getCompanyLogosLoadingErrorMessage = (state: State) => state.errorMessage;

