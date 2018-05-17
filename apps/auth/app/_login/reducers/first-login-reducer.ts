import * as fromFirstLoginActions from '../actions/first-login.action';

export interface State {
  validatingFirsLogin: boolean;
  validatingFirsLoginSuccess: boolean;
  validatingFirsLoginError: boolean;
  updatingPassword: boolean;
  updatingPasswordSuccess: boolean;
  updatingPasswordError: boolean;
}

export const initialState: State = {
  validatingFirsLogin: false,
  validatingFirsLoginSuccess: false,
  validatingFirsLoginError: false,
  updatingPassword: false,
  updatingPasswordSuccess: false,
  updatingPasswordError: false
};

export function reducer(state = initialState, action: fromFirstLoginActions.Actions): State {
  switch (action.type) {
    case fromFirstLoginActions.VALIDATE_FIRST_LOGIN: {
      return {
        ...state,
        validatingFirsLogin: true
      };
    }
    case fromFirstLoginActions.VALIDATE_FIRST_LOGIN_SUCCESS: {
      return {
        ...state,
        validatingFirsLogin: false,
        validatingFirsLoginSuccess: true,
        validatingFirsLoginError: false
      };
    }
    case fromFirstLoginActions.VALIDATE_FIRST_LOGIN_ERROR: {
      return {
        ...state,
        validatingFirsLogin: false,
        validatingFirsLoginSuccess: false,
        validatingFirsLoginError: true
      };
    }
    case fromFirstLoginActions.FIRST_LOGIN_UPDATING_PASSWORD: {
      return {
        ...state,
        updatingPassword: true,
        updatingPasswordError: false,
        updatingPasswordSuccess: false
      };
    }
    case fromFirstLoginActions.FIRST_LOGIN_UPDATING_PASSWORD_SUCCESS: {
      return {
        ...state,
        updatingPassword: false,
        updatingPasswordSuccess: true,
        updatingPasswordError: false
      };
    }
    case fromFirstLoginActions.FIRST_LOGIN_UPDATING_PASSWORD_ERROR: {
      return {
        ...state,
        updatingPassword: false,
        updatingPasswordError: true,
        updatingPasswordSuccess: false
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getValidatingFirstLogin = (state: State) => state.validatingFirsLogin;
export const getValidatingFirstLoginSuccess = (state: State) => state.validatingFirsLoginSuccess;
export const getValidatingFirstLoginError = (state: State) => state.validatingFirsLoginError;
export const getUpdatingPassword = (state: State) => state.updatingPassword;
export const getUpdatingPasswordSuccess = (state: State) => state.updatingPasswordSuccess;
export const getUpdatingPasswordError = (state: State) => state.updatingPasswordError;
