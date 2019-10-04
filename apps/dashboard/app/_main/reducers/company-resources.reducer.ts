import * as fromCompanyResourcesPageActions from '../actions/company-resources.actions';
import { CompanyResourcePost, CompanyResourceFolderPost } from '../models';


export interface State {
    addingCompanyResource: boolean;
    addingCompanyResourceSuccess: boolean;
    companyResourceId: number;
    companyResourceToAdd: CompanyResourcePost;
    loadingCompanyResources: boolean;
    loadingCompanyResourcesError: boolean;
  }

  const initialState: State = {
    addingCompanyResource: null,
    addingCompanyResourceSuccess: false,
    companyResourceId: null,
    companyResourceToAdd: null,
    loadingCompanyResources: false,
    loadingCompanyResourcesError: false
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
          addingCompanyResource: true,
          addingCompanyResourceSuccess: false,
          companyResourceToAdd: action.payload
        };
      }
      case fromCompanyResourcesPageActions.ADDING_COMPANY_RESOURCE_SUCCESS: {
        return {
          ...state,
          addingCompanyResource: false,
          addingCompanyResourceSuccess: true
        };
      }
      case fromCompanyResourcesPageActions.ADDING_COMPANY_RESOURCE_ERROR: {
        return {
          ...state,
          addingCompanyResource: false
        };
      }
      case fromCompanyResourcesPageActions.DELETING_COMPANY_RESOURCE: {
        return {
          ...state,
          companyResourceId: action.payload
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

  export const getCompanyResourcesLoading = (state: State) => state.loadingCompanyResources;
  export const getCompanyResourcesLoadingError = (state: State) => state.loadingCompanyResourcesError;
  export const getCompanyResourceToAdd = (state: State) => state.companyResourceToAdd;
  export const getCompanyResourceId = (state: State) => state.companyResourceId;
  export const getAddingCompanyResource = (state: State) => state.addingCompanyResource;
  export const getAddingCompanyResourceSuccess = (state: State) => state.addingCompanyResourceSuccess;

