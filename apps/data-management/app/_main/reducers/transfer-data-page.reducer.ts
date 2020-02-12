import * as cloneDeep from 'lodash.clonedeep';

import { OrgDataEntityType } from 'libs/constants';

import { CredentialsPackage } from 'libs/models';

import { PayfactorsApiModelMapper } from '../helpers/payfactors-api-model-mapper';
import * as fromTransferDataPageActions from '../actions/transfer-data-page.actions';
import { TransferDataWorkflowStep } from '../data';
import { EntityTypeModel, Provider, TransferMethod } from '../models';

export interface State {
  loading: boolean;
  loadingError: boolean;
  transferMethods: TransferMethod[];
  providers: Provider[];
  selectedTransferMethod: number;
  selectedProvider: Provider;
  workflowStep: TransferDataWorkflowStep;
  validationErrors: string[];
  showAuthenticationModal: boolean;
  selectedEntities: EntityTypeModel[];
  activeConnection: CredentialsPackage;
}

export const initialState: State = {
  loading: false, // Change back after testing
  loadingError: false,
  transferMethods: null,
  providers: null,
  selectedTransferMethod: null,
  selectedProvider: null,
  validationErrors: null,
  workflowStep: null, //TransferDataWorkflowStep.SelectTransferMethod, // change back to first workflowstep
  showAuthenticationModal: false,
  selectedEntities: [],
  activeConnection: null
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
        workflowStep: null,
        // TODO: fix this for MVP
        // selectedProvider: null,
        // authenticationType: null,
        // validationErrors: null,
        // workflowStep: TransferDataWorkflowStep.SelectTransferMethod,
        // isValidCredentials: false,
        // isConnectionEstablished: false
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
        showAuthenticationModal: true,
      };
    }
    case fromTransferDataPageActions.VALIDATE_SUCCESS: {
      return {
        ...state,
        validationErrors: null,
        isValidCredentials: true,
        workflowStep: TransferDataWorkflowStep.Validated,
        showAuthenticationModal: false,
      };
    }
    case fromTransferDataPageActions.VALIDATE_ERROR: {
      if (action.payload) {
        return {
          ...state,
          validationErrors: action.payload,
          isValidCredentials: false,
          showAuthenticationModal: false
        };
      }
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromTransferDataPageActions.CREATE_CONNECTION: {
      return {
        ...state,
        loading: true
      };
    }
    case fromTransferDataPageActions.CREATE_CONNECTION_SUCCESS: {
      return {
        ...state,
        loading: false,
        activeConnection: action.payload
      };
    }
    case fromTransferDataPageActions.PROCEED_TO_AUTHENTICATION: {
      let selectedEntitiesClone = cloneDeep(state.selectedEntities);
      selectedEntitiesClone = PayfactorsApiModelMapper.mapEntityChoiceToEntityTypeModel(action.payload);
      return {
        ...state,
        workflowStep: TransferDataWorkflowStep.Authentication,
        selectedEntities: selectedEntitiesClone
      };
    }
    case fromTransferDataPageActions.UPDATE_WORKFLOWSTEP: {
      return {
        ...state,
        workflowStep: action.payload
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
export const getShowAuthenticatingModal = (state: State) => state.showAuthenticationModal;
export const getSelectedEntities = (state: State) => state.selectedEntities;
export const getActiveConnection = (state: State) => state.activeConnection;
