import * as fromSelfRegistrationActions from '../actions/self-registration.actions';
import { SelfRegistrationRequestForm } from 'libs/models/user/self-registration-request-form.model';
import { SelfRegistrationExistingCompany } from '../models/self-registration-existing-company.model';

export interface State {
  selfRegistrationForm: SelfRegistrationRequestForm;
  requestIsSubmitting: boolean;
  requestSubmitSuccess: boolean;
  requestSubmitError: boolean;
  completionIsSubmitting: boolean;
  completionSubmitSuccess: boolean;
  completionSubmitError: boolean;
  validatingToken: boolean;
  validatingTokenSuccess: boolean;
  validatingTokenError: boolean;
  validatingTokenExpired: boolean;
  validatingTokenAccountExists: boolean;
  validatingTokenExistingCompany: SelfRegistrationExistingCompany;
  validatedToken: string;
  accountEmail: string;
}

export const initialState: State = {
  selfRegistrationForm: null,
  requestIsSubmitting: false,
  requestSubmitSuccess: false,
  requestSubmitError: false,
  completionIsSubmitting: false,
  completionSubmitSuccess: false,
  completionSubmitError: false,
  validatingToken: false,
  validatingTokenSuccess: false,
  validatingTokenError: false,
  validatingTokenExpired: false,
  validatingTokenAccountExists: false,
  validatingTokenExistingCompany: null,
  validatedToken: null,
  accountEmail: null
};

export function reducer(state = initialState, action: fromSelfRegistrationActions.Actions): State {
  switch (action.type) {
    // Initial Request Form
    case fromSelfRegistrationActions.REQUEST_SUBMIT: {
      return {
        ...state,
        requestIsSubmitting: true
      };
    }
    case fromSelfRegistrationActions.REQUEST_SUBMIT_SUCCESS: {
      return {
        ...state,
        requestIsSubmitting: false,
        requestSubmitSuccess: true
      };
    }
    case fromSelfRegistrationActions.REQUEST_SUBMIT_ERROR: {
      return {
        ...state,
        requestIsSubmitting: false,
        requestSubmitError: true
      };
    }
    case fromSelfRegistrationActions.FIELD_CHANGE: {
      return {
        ...state,
        selfRegistrationForm: action.payload
      };
    }
    // Token/Validation
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
    case fromSelfRegistrationActions.VALIDATE_TOKEN_COMPANY_EXISTS: {
      return {
        ...state,
        validatingToken: false,
        validatingTokenExistingCompany: action.payload,
      };
    }
    // Password/Completion Form
    case fromSelfRegistrationActions.COMPLETION_SUBMIT: {
      return {
        ...state,
        completionIsSubmitting: true
      };
    }
    case fromSelfRegistrationActions.COMPLETION_SUBMIT_SUCCESS: {
      return {
        ...state,
        completionIsSubmitting: false,
        completionSubmitSuccess: true
      };
    }
    case fromSelfRegistrationActions.COMPLETION_SUBMIT_ERROR: {
      return {
        ...state,
        completionIsSubmitting: false,
        completionSubmitError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getSelfRegistrationForm = (state: State) => state.selfRegistrationForm;
// Initial form on login page
export const getRequestIsSubmitting = (state: State) => state.requestIsSubmitting;
export const getRequestSubmitSuccess = (state: State) => state.requestSubmitSuccess;
export const getRequestSubmitError = (state: State) => state.requestSubmitError;
// Completion form with password
export const getCompletionIsSubmitting = (state: State) => state.completionIsSubmitting;
export const getCompletionSubmitSuccess = (state: State) => state.completionSubmitSuccess;
export const getCompletionSubmitError = (state: State) => state.completionSubmitError;
// Token/misc
export const getValidatingToken = (state: State) => state.validatingToken;
export const getValidatingTokenSuccess = (state: State) => state.validatingTokenSuccess;
export const getValidatingTokenError = (state: State) => state.validatingTokenError;
export const getValidatingTokenExpired = (state: State) => state.validatingTokenExpired;
export const getValidatingTokenAccountExists = (state: State) => state.validatingTokenAccountExists;
export const getValidatedToken = (state: State) => state.validatedToken;
export const getValidatingTokenExistingCompany = (state: State) => state.validatingTokenExistingCompany;
export const getAccountEmail = (state: State) => state.accountEmail;
