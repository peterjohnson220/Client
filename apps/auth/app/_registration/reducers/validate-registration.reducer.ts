import * as fromValidateRegistrationActions from '../actions/validate-registration.actions';
import { RegistrationForm } from 'libs/models/user/registration-form.model';
import { SelfRegistrationExistingCompany } from '../models/self-registration-existing-company.model';

export interface State {
  validatingToken: boolean;
  validatingTokenSuccess: boolean;
  validatingTokenError: boolean;
  validatingTokenExpired: boolean;
  validatingTokenAccountExists: boolean;
  validatingTokenExistingCompany: SelfRegistrationExistingCompany;
  validatedToken: string;
  resendingToken: boolean;
  resendingTokenSuccess: boolean;
  resendingTokenError: boolean;
  accountEmail: string;
}

export const initialState: State = {
  validatingToken: false,
  validatingTokenSuccess: false,
  validatingTokenError: false,
  validatingTokenExpired: false,
  validatingTokenAccountExists: false,
  validatingTokenExistingCompany: null,
  validatedToken: null,
  resendingToken: false,
  resendingTokenSuccess: false,
  resendingTokenError: false,
  accountEmail: null
};

export function reducer(state = initialState, action: fromValidateRegistrationActions.Actions): State {
  switch (action.type) {
    case fromValidateRegistrationActions.VALIDATE_TOKEN: {
      return {
        ...state,
        validatingToken: true
      };
    }
    case fromValidateRegistrationActions.VALIDATE_TOKEN_SUCCESS: {
      return {
        ...state,
        validatingToken: false,
        validatingTokenSuccess: true,
        validatedToken: action.payload.token
      };
    }
    case fromValidateRegistrationActions.VALIDATE_TOKEN_ERROR: {
      return {
        ...state,
        validatingToken: false,
        validatingTokenError: true
      };
    }
    case fromValidateRegistrationActions.VALIDATE_TOKEN_EXPIRED: {
      return {
        ...state,
        validatingToken: false,
        validatingTokenExpired: true
      };
    }
    case fromValidateRegistrationActions.VALIDATE_TOKEN_ACCOUNT_EXISTS: {
      return {
        ...state,
        validatingToken: false,
        validatingTokenAccountExists: true,
        accountEmail: action.payload.accountEmail
      };
    }
    case fromValidateRegistrationActions.VALIDATE_TOKEN_COMPANY_EXISTS: {
      return {
        ...state,
        validatingToken: false,
        validatingTokenExistingCompany: action.payload,
      };
    }
    case fromValidateRegistrationActions.RESEND_TOKEN: {
      return {
        ...state,
        resendingToken: true
      };
    }
    case fromValidateRegistrationActions.RESEND_TOKEN_SUCCESS: {
      return {
        ...state,
        resendingToken: false,
        resendingTokenSuccess: true,
        accountEmail: action.payload.email
      };
    }
    case fromValidateRegistrationActions.RESEND_TOKEN_ERROR: {
      return {
        ...state,
        resendingToken: false,
        resendingTokenError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getValidatingToken = (state: State) => state.validatingToken;
export const getValidatingTokenSuccess = (state: State) => state.validatingTokenSuccess;
export const getValidatingTokenError = (state: State) => state.validatingTokenError;
export const getValidatingTokenExpired = (state: State) => state.validatingTokenExpired;
export const getValidatingTokenAccountExists = (state: State) => state.validatingTokenAccountExists;
export const getValidatedToken = (state: State) => state.validatedToken;
export const getValidatingTokenExistingCompany = (state: State) => state.validatingTokenExistingCompany;
export const getResendingToken = (state: State) => state.resendingToken;
export const getResendingTokenSuccess = (state: State) => state.resendingTokenSuccess;
export const getResendingTokenError = (state: State) => state.resendingTokenError;
export const getAccountEmail = (state: State) => state.accountEmail;
