import * as fromCompanyDescriptionActions from '../actions/';

export interface State {
  isLoadingCompanyDescription: boolean;
  loadingCompanyDescriptionError: boolean;
  companyDescription: string;
  isLoadingSubsidiaryDescription: boolean;
  loadingSubsidiaryDescriptionError: boolean;
  subsidiaryDescription: string;
}

export const initialState: State = {
  isLoadingCompanyDescription: false,
  loadingCompanyDescriptionError: false,
  companyDescription: null,
  isLoadingSubsidiaryDescription: false,
  loadingSubsidiaryDescriptionError: false,
  subsidiaryDescription: null
};

export function reducer(state = initialState, action: fromCompanyDescriptionActions.Actions): State {
  switch (action.type) {
    case fromCompanyDescriptionActions.GET_COMPANY_DESCRIPTION: {
      return {
        ...state,
        isLoadingCompanyDescription: true,
        loadingCompanyDescriptionError: false
      };
    }

    case fromCompanyDescriptionActions.GET_COMPANY_DESCRIPTION_SUCCESS: {
      return{
        ...state,
        isLoadingCompanyDescription: false,
        companyDescription: action.payload
      };
    }

    case fromCompanyDescriptionActions.GET_COMPANY_DESCRIPTION_ERROR: {
      return {
        ...state,
        isLoadingCompanyDescription: false,
        loadingCompanyDescriptionError: true
      };
    }

    case fromCompanyDescriptionActions.GET_SUBSIDIARY_DESCRIPTION: {
      return {
        ...state,
        isLoadingSubsidiaryDescription: true,
        loadingSubsidiaryDescriptionError: false
      };
    }

    case fromCompanyDescriptionActions.GET_SUBSIDIARY_DESCRIPTION_SUCCESS: {
      return{
        ...state,
        isLoadingSubsidiaryDescription: false,
        subsidiaryDescription: action.payload
      };
    }

    case fromCompanyDescriptionActions.GET_SUBSIDIARY_DESCRIPTION_ERROR: {
      return {
        ...state,
        isLoadingSubsidiaryDescription: false,
        loadingSubsidiaryDescriptionError: true
      };
    }

    default:
      return state;
  }
}

export const getCompanyDescription = (state: State) => state.companyDescription;
export const getIsLoadingCompanyDescription = (state: State) => state.isLoadingCompanyDescription;
export const getSubsidiaryDescription = (state: State) => state.subsidiaryDescription;
export const getIsLoadingSubsidiaryDescription = (state: State) => state.isLoadingSubsidiaryDescription;
