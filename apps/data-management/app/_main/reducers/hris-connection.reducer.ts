import cloneDeep from 'lodash/cloneDeep';

import { CredentialsPackage } from 'libs/models/hris-api/connection/request';

import * as fromHrisConnectionActions from '../actions/hris-connection.actions';
import { ConnectionSummary } from '../models';

export interface State {
  loading: boolean;
  loadingError: boolean;
  activeConnection: CredentialsPackage;
  saving: boolean;
  savingError: boolean;
  deleteCompleted: boolean;
  summary: ConnectionSummary;
  validationErrors: string[];
  isValidCredentials: boolean;
  showAuthenticationWarning: boolean;
  openReauthenticationModal: boolean;
  fullReplaceEmployees: boolean;
  fullReplaceStructureMappings: boolean;
  fullReplaceBenefits: boolean;
  fullReplaceEmployeeTags: boolean;
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  activeConnection: null,
  saving: false,
  savingError: false,
  deleteCompleted: null,
  summary: null,
  validationErrors: null,
  isValidCredentials: false,
  showAuthenticationWarning: false,
  openReauthenticationModal: false,
  fullReplaceEmployees: true,
  fullReplaceStructureMappings: true,
  fullReplaceBenefits: true,
  fullReplaceEmployeeTags: true
};

export function reducer(state: State = initialState, action: fromHrisConnectionActions.Actions) {
  switch (action.type) {
    case fromHrisConnectionActions.TOGGLE_VALIDATION_MODE:
    case fromHrisConnectionActions.GET_CURRENT_HRIS_CONNECTION: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromHrisConnectionActions.GET_CURRENT_HRIS_CONNECTION_SUCCESS: {
      return {
        ...state,
        loading: false,
        loadingError: false,
        activeConnection: action.payload
      };
    }
    case fromHrisConnectionActions.TOGGLE_VALIDATION_MODE_ERROR:
    case fromHrisConnectionActions.GET_CURRENT_HRIS_CONNECTION_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromHrisConnectionActions.DELETE_HRIS_CONNECTION: {
      return {
        ...state,
        saving: true,
        savingError: false
      };
    }
    case fromHrisConnectionActions.DELETE_HRIS_CONNECTION_SUCCESS: {
      return {
        ...state,
        saving: false,
        savingError: false,
        deleteCompleted: true
      };
    }
    case fromHrisConnectionActions.DELETE_HRIS_CONNECTION_ERROR: {
      return {
        ...state,
        saving: false,
        savingError: true
      };
    }
    case fromHrisConnectionActions.GET_HRIS_CONNECTION_SUMMARY: {
      return {
        ...state,
        loading: true,
        loadingError: false,
        summary: null
      };
    }
    case fromHrisConnectionActions.GET_HRIS_CONNECTION_SUMMARY_SUCCESS: {
      return {
        ...state,
        loading: false,
        loadingError: false,
        summary: action.payload
      };
    }
    case fromHrisConnectionActions.GET_HRIS_CONNECTION_SUMMARY_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromHrisConnectionActions.VALIDATE_SUCCESS: {
      return {
        ...state,
        validationErrors: null,
        loading: false,
        loadingError: false,
        isValidCredentials: action.payload.success,
        showAuthenticationWarning: action.payload.skipValidation,
        saving: false
      };
    }
    case fromHrisConnectionActions.VALIDATE_ERROR: {
      if (action.payload) {
        return {
          ...state,
          loading: false,
          loadingError: false,
          validationErrors: action.payload,
          isValidCredentials: false,
          saving: false
        };
      }
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromHrisConnectionActions.OUTBOUND_JDM_VALIDATE:
    case fromHrisConnectionActions.CREATE_CONNECTION: {
      return {
        ...state,
        loading: true
      };
    }
    case fromHrisConnectionActions.OUTBOUND_JDM_VALIDATE_SUCCESS: {
      return {
        ...state,
        loading: false
      };
    }
    case fromHrisConnectionActions.CREATE_CONNECTION_SUCCESS: {
      const connectionSummary = cloneDeep(state.summary);
      connectionSummary.connectionID = action.payload.connectionId;

      return {
        ...state,
        activeConnection: action.payload.credentials,
        summary: connectionSummary
      };
    }
    case fromHrisConnectionActions.CREATE_CONNECTION_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromHrisConnectionActions.OPEN_REAUTHENTICATION_MODAL: {
      return {
        ...state,
        openReauthenticationModal: action.payload
      };
    }
    case fromHrisConnectionActions.PATCH_CONNECTION: {
      return {
        ...state,
        saving: true
      };
    }
    case fromHrisConnectionActions.PATCH_CONNECTION_SUCCESS: {
      const connectionSummary = cloneDeep(state.summary);
      connectionSummary.connectionID = action.payload;

      return {
        ...state,
        connectionSummary: connectionSummary
      };
    }
    case fromHrisConnectionActions.SET_FULLREPLACE_MODE: {
      return {
        ...state,
        fullReplaceEmployees: action.payload.employeeFullReplace,
        fullReplaceStructureMappings: action.payload.structureMappingsFullReplace
      };
    }
    case fromHrisConnectionActions.TOGGLE_FULLREPLACE_MODE: {
      return {
        ...state,
        fullReplaceEmployees: action.payload.entityType.toLowerCase() === 'employees' ?
          action.payload.doFullReplace : state.fullReplaceEmployees,
        fullReplaceStructureMappings: action.payload.entityType.toLowerCase() === 'structuremapping' ?
          action.payload.doFullReplace : state.fullReplaceStructureMappings
      };
    }
    default:
      return state;
  }
}

export const getConnection = (state: State) => state.activeConnection;
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getSaving = (state: State) => state.saving;
export const getSavingError = (state: State) => state.savingError;
export const getDeleteCompleted = (state: State) => state.deleteCompleted;
export const getConnectionSummary = (state: State) => state.summary;
export const getShowAuthenticationWarning = (state: State) => state.showAuthenticationWarning;
export const getValidationErrors = (state: State) => state.validationErrors;
export const getActiveConnectionId = (state: State) => state.summary && state.summary.connectionID ? state.summary.connectionID : null;
export const getReauthenticationModalOpen = (state: State) => state.openReauthenticationModal;
export const getIsValidCredentials = (state: State) => state.isValidCredentials;
export const getFullReplaceModes = (state: State) => {
  return {
    doFullReplaceEmployees: state.fullReplaceEmployees,
    doFullReplaceStructureMappings: state.fullReplaceStructureMappings,
    doFullReplaceBenefits: state.fullReplaceBenefits,
    doFullReplaceEmployeeTags: state.fullReplaceEmployeeTags
  };
};
