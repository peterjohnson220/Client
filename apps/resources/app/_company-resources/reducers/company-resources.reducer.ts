import * as fromCompanyResourcesPageActions from '../actions/company-resources.actions';
import { CompanyResourcePost } from '../models';


export interface State {
    addingCompanyResource: boolean;
    addingCompanyResourceSuccess: boolean;
    addingCompanyResourceErrorMsg: string;
    companyResourceId: number;
    companyResourceToAdd: CompanyResourcePost;
    deletingCompanyResource: boolean;
    deletingCompanyResourceSuccess: boolean;
    loadingCompanyResources: boolean;
    loadingCompanyResourcesError: boolean;
    showRenameResourceModal: boolean;
    showRenameFolderModal: boolean;
    savingFolderNameError: string;
  }

  const initialState: State = {
    addingCompanyResource: null,
    addingCompanyResourceSuccess: false,
    addingCompanyResourceErrorMsg: null,
    companyResourceId: null,
    companyResourceToAdd: null,
    deletingCompanyResource: null,
    deletingCompanyResourceSuccess: false,
    loadingCompanyResources: false,
    loadingCompanyResourcesError: false,
    showRenameResourceModal: false,
    showRenameFolderModal: false,
    savingFolderNameError: null
  };

  export function reducer(state: State = initialState, action: fromCompanyResourcesPageActions.Actions): State {
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
          addingCompanyResource: false,
          addingCompanyResourceErrorMsg: action.payload.error.error.message
        };
      }
      case fromCompanyResourcesPageActions.DELETING_COMPANY_RESOURCE: {
        return {
          ...state,
          companyResourceId: action.payload,
          deletingCompanyResource: true,
          deletingCompanyResourceSuccess: false
        };
      }
      case fromCompanyResourcesPageActions.DELETING_COMPANY_RESOURCE_SUCCESS: {
        return {
          ...state,
          companyResourceId: action.payload,
          deletingCompanyResource: false,
          deletingCompanyResourceSuccess: true
        };
      }
      case fromCompanyResourcesPageActions.DELETING_COMPANY_RESOURCE_ERROR: {
        return {
          ...state
        };
      }
      case fromCompanyResourcesPageActions.OPEN_RENAME_RESOURCE_MODAL: {
        return {
          ...state,
          showRenameResourceModal: true
        };
      }
      case fromCompanyResourcesPageActions.CLOSE_RENAME_RESOURCE_MODAL: {
        return {
          ...state,
          showRenameResourceModal: false
        };
      }
      case fromCompanyResourcesPageActions.OPEN_RENAME_FOLDER_MODAL: {
        return {
          ...state,
          showRenameFolderModal: true
        };
      }
      case fromCompanyResourcesPageActions.CLOSE_RENAME_FOLDER_MODAL: {
        return {
          ...state,
          showRenameFolderModal: false,
          savingFolderNameError: null
        };
      }
      case fromCompanyResourcesPageActions.UPDATE_FOLDER_NAME: {
        return {
          ...state,
          savingFolderNameError: null
        };
      }
      case fromCompanyResourcesPageActions.UPDATE_FOLDER_NAME_ERROR: {
        return {
          ...state,
          savingFolderNameError: action.errorMessage
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
  export const getAddingCompanyResourceErrorMsg = (state: State) => state.addingCompanyResourceErrorMsg;
  export const getDeletingCompanyResourceSuccess = (state: State) => state.deletingCompanyResourceSuccess;
  export const getShowRenameResourceModal = (state: State) => state.showRenameResourceModal;
  export const getShowRenameFolderModal = (state: State) => state.showRenameFolderModal;
  export const getSavingFolderNameError = (state: State) => state.savingFolderNameError;
