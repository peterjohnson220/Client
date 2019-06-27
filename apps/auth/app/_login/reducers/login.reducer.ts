import * as fromLoginActions from '../actions/login.actions';

export interface State {
  login: boolean;
  loginSuccess: boolean;
  loginError: boolean;
  passwordExpired: boolean;
}

export const initialState: State = {
  login: false,
  loginSuccess: false,
  loginError: false,
  passwordExpired: false,
};

export function reducer(state = initialState, action: fromLoginActions.Actions): State {
  switch (action.type) {
    case fromLoginActions.LOGIN: {
      return {
        ...state,
        login: true
      };
    }
    case fromLoginActions.LOGIN_SUCCESS: {
      return {
        ...state,
        login: false,
        loginSuccess: true,
        loginError: false
      };
    }
    case fromLoginActions.LOGIN_ERROR: {
      return {
        ...state,
        login: false,
        loginSuccess: false,
        loginError: true,
      };
    }
    case fromLoginActions.PASSWORD_EXPIRED: {
      return {
        ...state,
        login: false,
        loginSuccess: false,
        loginError: false,
        passwordExpired: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getLogin = (state: State) => state.login;
export const getLoginSuccess = (state: State) => state.loginSuccess;
export const getLoginError = (state: State) => state.loginError;
export const getPasswordExpired = (state: State) => state.passwordExpired;
