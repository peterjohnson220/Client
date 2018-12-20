import * as fromLoginActions from '../actions/login.actions';

export interface State {
  login: boolean;
  loginSuccess: boolean;
  loginError: boolean;
}

export const initialState: State = {
  login: false,
  loginSuccess: false,
  loginError: false
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
        loginError: true
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
