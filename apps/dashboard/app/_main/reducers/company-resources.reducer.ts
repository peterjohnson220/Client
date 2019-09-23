import * as fromCompanyResourcesPageActions from '../actions/company-resources.actions';
import { CompanyResources, CompanyResourcePost } from '../models';

export interface State {
    companyResources: CompanyResources;
    loadingCompanyResources: boolean;
    loadingCompanyResourcesError: boolean;
    companyResourceToAdd: CompanyResourcePost;
    companyResourceId: number;
  }

  const initialState: State = {
    companyResources: null,
    loadingCompanyResources: false,
    loadingCompanyResourcesError: false,
    companyResourceToAdd: null,
    companyResourceId: null
  };

  export function reducer(state: State = initialState, action: fromCompanyResourcesPageActions.Actions) {
    switch (action.type) {
      case fromCompanyResourcesPageActions.GETTING_COMPANY_RESOURCES: {
        return {
          ...state,
          loadingCompanyResources: true,
          loadingCompanyResourcesError: false
        };
      }
      case fromCompanyResourcesPageActions.GETTING_COMPANY_RESOURCES_SUCCESS: {
        return {
          ...state,
          companyResources: action.payload,
          loadingCompanyResources: false
        };
      }
      case fromCompanyResourcesPageActions.GETTING_COMPANY_RESOURCES_ERROR: {
        return {
          ...state,
          loadingCompanyResources: false,
          loadingCompanyResourcesError: true
        };
      }
      case fromCompanyResourcesPageActions.ADDING_COMPANY_RESOURCE: {
        return {
          ...state,
          companyResourceToAdd: action.payload
        };
      }
      case fromCompanyResourcesPageActions.ADDING_COMPANY_RESOURCE_SUCCESS: {
        return {
          ...state
        };
      }
      case fromCompanyResourcesPageActions.ADDING_COMPANY_RESOURCE_ERROR: {
        return {
          ...state
        };
      }
      case fromCompanyResourcesPageActions.DELETING_COMPANY_RESOURCE: {
        return {
          ...state,
          companyResourceId: action.payload
        };
      }
      case fromCompanyResourcesPageActions.DELETING_COMPANY_RESOURCE_SUCCESS: {
        return {
          ...state
        };
      }
      case fromCompanyResourcesPageActions.DELETING_COMPANY_RESOURCE_ERROR: {
        return {
          ...state
        };
      }
      default: {
        return state;
      }
    }
  }

  export const getCompanyResources = (state: State) => state.companyResources;
  export const getCompanyResourcesLoading = (state: State) => state.loadingCompanyResources;
  export const getCompanyResourcesLoadingError = (state: State) => state.loadingCompanyResourcesError;
  export const getCompanyResourceToAdd = (state: State) => state.companyResourceToAdd;
  export const getCompanyResourceId = (state: State) => state.companyResourceId;
