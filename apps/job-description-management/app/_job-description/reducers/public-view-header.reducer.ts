import cloneDeep from 'lodash/cloneDeep';

import { CompanyDto } from 'libs/models/company';

import * as fromPublicViewHeaderActions from '../actions/public-view-header.actions';

export interface State {
  loadingCompanyInformation: boolean;
  loadingCompanyInformationError: boolean;
  company: CompanyDto;
}

export const initialState: State = {
  loadingCompanyInformation: false,
  loadingCompanyInformationError: false,
  company: null,
};

export function reducer(state = initialState, action: fromPublicViewHeaderActions.Actions): State {
  switch (action.type) {
    case fromPublicViewHeaderActions.LOAD_COMPANY_INFORMATION:
      return {
        ...state,
        loadingCompanyInformation: true
      };
    case fromPublicViewHeaderActions.LOAD_COMPANY_INFORMATION_ERROR:
      return {
        ...state,
        loadingCompanyInformation: false,
        loadingCompanyInformationError: true
      };
    case fromPublicViewHeaderActions.LOAD_COMPANY_INFORMATION_SUCCESS:
      return {
        ...state,
        loadingCompanyInformation: false,
        company: cloneDeep(action.payload)
      };
    default:
      return state;
  }
}

export const getCompanyInformationLoading = (state: State) => state.loadingCompanyInformation;
export const getCompanyInformationLoadingError = (state: State) => state.loadingCompanyInformationError;
export const getCompany = (state: State) => state.company;
