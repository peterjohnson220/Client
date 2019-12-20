import * as fromOrganizationalDataPageActions from '../actions/organizational-data-page.action';
import {ConfigurationGroup} from '../models';

export interface State {
  organizationalDataTemplateLink: string;
  organizationalDataTemplateLinkError: boolean;
  isModalOpen: boolean;
  isLoading: boolean;
  hasError: boolean;
  savedConfigurationGroup: ConfigurationGroup;
  configurationGroup: ConfigurationGroup;
  hasUploadedFiles: boolean;
  isProcessingMapping: boolean;
}

export const initialState: State = {
  organizationalDataTemplateLink: null,
  organizationalDataTemplateLinkError: false,
  isModalOpen: false,
  isLoading: false,
  hasError: false,
  configurationGroup: null,
  hasUploadedFiles: false,
  isProcessingMapping: false,
  savedConfigurationGroup: null
};

export function reducer(state = initialState, action: fromOrganizationalDataPageActions.Actions): State {
  switch (action.type) {
    case fromOrganizationalDataPageActions.GET_ORGANIZATIONAL_HEADERS_LINK: {
      return {
        ...state,
        organizationalDataTemplateLink: null,
        organizationalDataTemplateLinkError: false
      };
    }
    case fromOrganizationalDataPageActions.GET_ORGANIZATIONAL_HEADERS_LINK_SUCCESS: {
      return {
        ...state,
        organizationalDataTemplateLink: action.payload,
        organizationalDataTemplateLinkError: false
      };
    }
    case fromOrganizationalDataPageActions.GET_ORGANIZATIONAL_HEADERS_LINK_ERROR: {
      return {
        ...state,
        organizationalDataTemplateLink: null,
        organizationalDataTemplateLinkError: true
      };
    }
    case fromOrganizationalDataPageActions.SET_MODAL_STATE_OPEN: {
      return {
        ...state,
        isModalOpen: action.payload
      };
    }
    case fromOrganizationalDataPageActions.GET_CONFIGURATION_GROUP: {
      return {
        ...state,
        isLoading: true,
        hasError: false
      };
    }
    case fromOrganizationalDataPageActions.GET_CONFIGURATION_GROUP_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        configurationGroup: action.payload
      };
    }
    case fromOrganizationalDataPageActions.GET_CONFIGURATION_GROUP_FAILED: {
      return {
        ...state,
        isLoading: false,
        hasError: true
      };
    }
    case fromOrganizationalDataPageActions.UPLOAD_DATA: {
      return {
        ...state,
        hasUploadedFiles: false,
        isProcessingMapping: true,
        hasError: false
      };
    }
    case fromOrganizationalDataPageActions.UPLOAD_DATA_SUCCESS: {
      return {
        ...state,
        hasUploadedFiles: true,
        isProcessingMapping: false,
        hasError: false
      };
    }
    case fromOrganizationalDataPageActions.UPLOAD_DATA_FAILED: {
      return {
        ...state,
        hasUploadedFiles: false,
        isProcessingMapping: false,
        hasError: true
      };
    }
    case fromOrganizationalDataPageActions.SAVE_CONFIGURATION_GROUP: {
      return {
        ...state,
        isLoading: true,
        hasError: false
      };
    }
    case fromOrganizationalDataPageActions.SAVE_CONFIGURATION_GROUP_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        savedConfigurationGroup: action.payload
      };
    }
    case fromOrganizationalDataPageActions.SAVE_CONFIGURATION_GROUP_FAILED: {
      return {
        ...state,
        isLoading: false,
        hasError: true
      };
    }
    default:
      return state;
  }
}

export const getOrganizationalHeadersLink = (state: State) => state.organizationalDataTemplateLink;
export const getOrganizationalHeadersLinkError = (state: State) => state.organizationalDataTemplateLinkError;
export const getModalStateOpen = (state: State) => state.isModalOpen;
export const getConfigurationGroup = (state: State) => state.configurationGroup;
export const getSavedConfigurationGroup = (state: State) => state.savedConfigurationGroup;
export const getHasError = (state: State) => state.hasError;
export const fileUploadData = (state: State) => state.hasUploadedFiles;
export const fileUploadDataFailed = (state: State) => state.hasError;
export const isProcessingMapping = (state: State) => state.isProcessingMapping;
