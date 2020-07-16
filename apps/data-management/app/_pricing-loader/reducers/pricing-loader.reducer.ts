import { cloneDeep } from 'lodash';

import { ConfigurationGroup, EmailRecipientModel } from 'libs/models/data-loads';

import * as fromPricingLoaderActions from '../actions/pricing-loader.actions';

export interface State {
  configGroup: ConfigurationGroup;
  emailRecipient: EmailRecipientModel;
  savingConfigGroupSuccess: boolean;
  processing: boolean;
  processingSuccess: boolean;
  processingError: boolean;
  errorMessage: string;
}

const initialState: State = {
  configGroup: null,
  emailRecipient: null,
  savingConfigGroupSuccess: false,
  processing: false,
  processingSuccess: false,
  processingError: false,
  errorMessage: null
};

export function reducer(state = initialState, action: fromPricingLoaderActions.Actions): State {
  switch (action.type) {
    case fromPricingLoaderActions.SET_CONFIG_GROUP: {
      return {
        ...state,
        configGroup: action.payload
      };
    }
    case fromPricingLoaderActions.SET_EMAIL_RECIPIENT: {
      return {
        ...state,
        emailRecipient: action.payload
      };
    }
    case fromPricingLoaderActions.SAVE_CONFIG: {
      return {
        ...state,
        processing: true,
        savingConfigGroupSuccess: false,
        processingSuccess: false,
        processingError: false,
        errorMessage: null
      };
    }
    case fromPricingLoaderActions.SAVE_CONFIG_SUCCESS: {
      const configGroupClone: ConfigurationGroup = cloneDeep(state.configGroup);
      configGroupClone.LoaderConfigurationGroupId = action.payload.loaderConfigurationGroupId;
      return {
        ...state,
        savingConfigGroupSuccess: true,
        configGroup: configGroupClone
      };
    }
    case fromPricingLoaderActions.PROCESSING_SUCCESS: {
      return {
        ...state,
        processing: false,
        processingSuccess: true
      };
    }
    case fromPricingLoaderActions.PROCESSING_ERROR: {
      return {
        ...state,
        processing: false,
        processingError: true,
        errorMessage: action.payload.message
      };
    }
    case fromPricingLoaderActions.RESET_PRICING_LOADER_STATE: {
      return {
        ...state,
        configGroup: null,
        processing: false,
        processingError: false,
        savingConfigGroupSuccess: false,
        errorMessage: null
      };
    }
    default: {
      return state;
    }
  }
}

export const getConfigGroup = (state: State) => state.configGroup;
export const getEmailRecipient = (state: State) => state.emailRecipient;
export const getProcessing = (state: State) => state.processing;
export const getProcessingSuccess = (state: State) => state.processingSuccess;
export const getProcessingError = (state: State) => state.processingError;
export const getErrorMessage = (state: State) => state.errorMessage;
export const getSavingConfigGroupSuccess = (state: State) => state.savingConfigGroupSuccess;
