import * as fromSelfRegistrationActions from '../actions/self-registration.actions';
import { SelfRegistrationForm } from 'libs/models/user/self-registration-form.model';

export interface State {
  selfRegistrationForm: SelfRegistrationForm;
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: boolean;
  validatingToken: boolean;
  validatingTokenSuccess: boolean;
  validatingTokenError: boolean;
  validatingTokenExpired: boolean;
  validatingTokenAccountExists: boolean;
  validatedToken: string;
  accountEmail: string;
}

export const initialState: State = {
  selfRegistrationForm: null,
  isSubmitting: false,
  submitSuccess: false,
  submitError: false,
  validatingToken: false,
  validatingTokenSuccess: false,
  validatingTokenError: false,
  validatingTokenExpired: false,
  validatingTokenAccountExists: false,
  validatedToken: null,
  accountEmail: null
};

export function reducer(state = initialState, action: fromSelfRegistrationActions.Actions): State {
  switch (action.type) {
    case fromSelfRegistrationActions.FIELD_CHANGE: {
      return {
        ...state,
        selfRegistrationForm: action.payload
      };
    }
    case fromSelfRegistrationActions.SUBMIT: {
      return {
        ...state,
        isSubmitting: true
      };
    }
    case fromSelfRegistrationActions.SUBMIT_SUCCESS: {
      return {
        ...state,
        isSubmitting: false,
        submitSuccess: true
      };
    }
    case fromSelfRegistrationActions.SUBMIT_ERROR: {
      return {
        ...state,
        isSubmitting: false,
        submitError: true
      };
    }
    case fromSelfRegistrationActions.VALIDATE_TOKEN: {
      return {
        ...state,
        validatingToken: true
      };
    }
    case fromSelfRegistrationActions.VALIDATE_TOKEN_SUCCESS: {
      return {
        ...state,
        validatingToken: false,
        validatingTokenSuccess: true,
        validatedToken: action.payload.token
      };
    }
    case fromSelfRegistrationActions.VALIDATE_TOKEN_ERROR: {
      return {
        ...state,
        validatingToken: false,
        validatingTokenError: true
      };
    }
    case fromSelfRegistrationActions.VALIDATE_TOKEN_EXPIRED: {
      return {
        ...state,
        validatingToken: false,
        validatingTokenExpired: true
      };
    }
    case fromSelfRegistrationActions.VALIDATE_TOKEN_ACCOUNT_EXISTS: {
      return {
        ...state,
        validatingToken: false,
        validatingTokenAccountExists: true,
        accountEmail: action.payload.accountEmail
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getSelfRegistrationForm = (state: State) => state.selfRegistrationForm;
export const getIsSubmitting = (state: State) => state.isSubmitting;
export const getSubmitSuccess = (state: State) => state.submitSuccess;
export const getSubmitError = (state: State) => state.submitError;
export const getValidatingToken = (state: State) => state.validatingToken;
export const getValidatingTokenSuccess = (state: State) => state.validatingTokenSuccess;
export const getValidatingTokenError = (state: State) => state.validatingTokenError;
export const getValidatingTokenExpired = (state: State) => state.validatingTokenExpired;
export const getValidatingTokenAccountExists = (state: State) => state.validatingTokenAccountExists;
export const getValidatedToken = (state: State) => state.validatedToken;
export const getAccountEmail = (state: State) => state.accountEmail;
