import * as fromCompanyResourcesPageActions from '../actions/company-resources.actions';
import { CompanyResources, CompanyResourcePost } from '../models';
import { CompanyResourceFolder } from '../models/company-resource-folder.model';

export interface State {
    companyResources: CompanyResources;
    loadingCompanyResources: boolean;
    loadingCompanyResourcesError: boolean;
    companyResourceToAdd: CompanyResourcePost;
    companyResourceId: number;
    companyResourceFolder: CompanyResourceFolder;
    addingCompanyResourceFolder: boolean;
    addingCompanyResourceFolderSuccess: boolean;
    addingCompanyResourceFolderError: any;
    deletingCompanyResourceFolder: string;
    deletingCompanyResourceFolderSuccess: boolean;
    deletingCompanyResourceFolderError: boolean;
  }

  const initialState: State = {
    companyResources: null,
    loadingCompanyResources: false,
    loadingCompanyResourcesError: false,
    companyResourceToAdd: null,
    companyResourceId: null,
    companyResourceFolder: null,
    addingCompanyResourceFolder: null,
    addingCompanyResourceFolderSuccess: null,
    addingCompanyResourceFolderError: null,
    deletingCompanyResourceFolder: null,
    deletingCompanyResourceFolderSuccess: null,
    deletingCompanyResourceFolderError: false
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
      case fromCompanyResourcesPageActions.ADDING_COMPANY_RESOURCE_FOLDER: {
        return {
          ...state,
          companyResourceFolder: action.payload,
          addingCompanyResourceFolder: true
        };
      }
      case fromCompanyResourcesPageActions.ADDING_COMPANY_RESOURCE_FOLDER_SUCCESS: {
        return {
          ...state,
          addingCompanyResourceFolder: false,
          addingCompanyResourceFolderSuccess: action.payload
        };
      }
      case fromCompanyResourcesPageActions.ADDING_COMPANY_RESOURCE_FOLDER_ERROR: {
        return {
          ...state,
          addingCompanyResourceFolder: false,
          addingCompanyResourceFolderError: action.payload
        };
      }
      case fromCompanyResourcesPageActions.DELETING_COMPANY_RESOURCE_FOLDER: {
        return {
          ...state,
          companyResourceId: action.payload
        };
      }
      case fromCompanyResourcesPageActions.DELETING_COMPANY_RESOURCE_FOLDER_SUCCESS: {
        return {
          ...state
        };
      }
      case fromCompanyResourcesPageActions.DELETING_COMPANY_RESOURCE_FOLDER_ERROR: {
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
  export const getCompanyResourceFolder = (state: State) => state.companyResourceFolder;
  export const getAddingCompanyResourceFolder = (state: State) => state.addingCompanyResourceFolder;
  export const getAddingCompanyResourceFolderSuccess = (state: State) => state.addingCompanyResourceFolderSuccess;
  export const getAddingCompanyResourceFolderError = (state: State) => state.addingCompanyResourceFolderError;
