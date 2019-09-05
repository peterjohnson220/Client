import * as fromTransferDataPageActions from '../actions/transfer-data-page.actions';
import { TransferMethod, Provider } from '../models';
import { TransferDataWorkflowStep } from '../data';


export interface State {
  loading: boolean;
  loadingError: boolean;
  transferMethods: TransferMethod[];
  providers: Provider[];
  selectedTransferMethod: number;
  selectedProvider: Provider;
  workflowStep: TransferDataWorkflowStep;
  validationErrors: string[];
}

const initialState: State = {
  loading: true,
  loadingError: false,
  transferMethods: null,
  providers: null,
  selectedTransferMethod: null,
  selectedProvider: null,
  validationErrors: null,
  workflowStep: TransferDataWorkflowStep.SelectTransferMethod
};

export function reducer(state: State = initialState, action: fromTransferDataPageActions.Actions) {
  switch (action.type) {
    case fromTransferDataPageActions.CREATE_CONNECTION_ERROR:
    case fromTransferDataPageActions.LOAD_AUTHENTICATION_FORM_ERROR:
    case fromTransferDataPageActions.LOAD_TRANSFER_METHODS_ERROR:
    case fromTransferDataPageActions.LOAD_PROVIDERS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromTransferDataPageActions.LOAD_TRANSFER_METHODS_SUCCESS: {
      return {
        ...state,
        transferMethods: action.payload
      };
    }
    case fromTransferDataPageActions.LOAD_PROVIDERS_SUCCESS: {
      return {
        ...state,
        loading: false,
        providers: action.payload
      };
    }
    case fromTransferDataPageActions.SET_SELECTED_TRANSFER_METHOD: {
      return {
        ...state,
        selectedTransferMethod: action.payload
      };
    }
    case fromTransferDataPageActions.SET_SELECTED_PROVIDER: {
      return {
        ...state,
        selectedProvider: action.payload
      };
    }
    case fromTransferDataPageActions.RESET_TRANSFER_DATA_PAGE_WORKFLOW: {
      return {
        ...state,
        selectedProvider: null,
        authenticationType: null,
        validationErrors: null,
        workflowStep: TransferDataWorkflowStep.SelectTransferMethod,
        isValidCredentials: false,
        isConnectionEstablished: false
      };
    }
    case fromTransferDataPageActions.LOAD_AUTHENTICATION_FORM_SUCCESS: {
      return {
        ...state,
        workflowStep: TransferDataWorkflowStep.Authentication
      };
    }
    case fromTransferDataPageActions.VALIDATE: {
      return {
        ...state,
        loading: true
      };
    }
    case fromTransferDataPageActions.VALIDATE_SUCCESS: {
      return {
        ...state,
        validationErrors: null
      };
    }
    case fromTransferDataPageActions.VALIDATE_ERROR: {
      if (action.payload) {
        return {
          ...state,
          loading: false,
          validationErrors: action.payload
        };
      }
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromTransferDataPageActions.CREATE_CONNECTION_SUCCESS: {
      return {
        ...state,
        loading: false,
        workflowStep: TransferDataWorkflowStep.Mappings
      };
    }
    default:
      return state;
  }
}

export const getTransferMethods = (state: State) => state.transferMethods;
export const getProviders = (state: State) => state.providers;
export const getSelectedTransferMethod = (state: State) => state.selectedTransferMethod;
export const getSelectedProvider = (state: State) => state.selectedProvider;
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getValidationErrors = (state: State) => state.validationErrors;
export const getWorkflowStep = (state: State) => state.workflowStep;
