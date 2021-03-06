import * as fromResetPasswordActions from '../actions/reset-password.actions';

export interface State {
  resettingPassword: boolean;
  resetPasswordSuccess: boolean;
  resetPasswordError: boolean;
  resetPasswordTokenExpired: boolean;
  resetPasswordAlreadyUsed: boolean;
  checkingResetPasswordToken: boolean;
  checkResetPasswordTokenSuccess: boolean;
  minimumLength: number;
  username: string;
}

export const initialState: State = {
  resettingPassword: false,
  resetPasswordSuccess: false,
  resetPasswordError: false,
  resetPasswordTokenExpired: false,
  resetPasswordAlreadyUsed: false,
  checkingResetPasswordToken: false,
  checkResetPasswordTokenSuccess: false,
  minimumLength: 8,
  username: ''
};

export function reducer(state = initialState, action: fromResetPasswordActions.Actions): State {
  switch (action.type) {
    case fromResetPasswordActions.RESET_PASSWORD: {
      return {
        ...state,
        resettingPassword: true,
        resetPasswordAlreadyUsed: false
      };
    }
    case fromResetPasswordActions.RESET_PASSWORD_SUCCESS: {
      return {
        ...state,
        resettingPassword: false,
        resetPasswordSuccess: true
      };
    }
    case fromResetPasswordActions.RESET_PASSWORD_TOKEN_EXPIRED: {
      return {
        ...state,
        resettingPassword: false,
        resetPasswordTokenExpired: true
      };
    }
    case fromResetPasswordActions.RESET_PASSWORD_ALREADY_USED: {
      return {
        ...state,
        resettingPassword: false,
        resetPasswordAlreadyUsed: true
      };
    }
    case fromResetPasswordActions.RESET_PASSWORD_ERROR: {
      return {
        ...state,
        resettingPassword: false,
        resetPasswordError: true
      };
    }
    case fromResetPasswordActions.CHECK_RESET_PASSWORD_TOKEN: {
      return {
        ...state,
        checkingResetPasswordToken: true
      };
    }
    case fromResetPasswordActions.CHECK_RESET_PASSWORD_TOKEN_SUCCESS: {
      return {
        ...state,
        checkingResetPasswordToken: false,
        checkResetPasswordTokenSuccess: true,
        resetPasswordTokenExpired: !action.payload.TokenIsValid,
        minimumLength: action.payload.MinimumLength,
        username: action.payload.Username
      };
    }
    case fromResetPasswordActions.CHECK_RESET_PASSWORD_TOKEN_ERROR: {
      return {
        ...state,
        checkingResetPasswordToken: false,
        resetPasswordError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getResettingPassword = (state: State) => state.resettingPassword;
export const getResettingPasswordSuccess = (state: State) => state.resetPasswordSuccess;
export const getResettingPasswordTokenExpired = (state: State) => state.resetPasswordTokenExpired;
export const getResettingPasswordAlreadyUsed = (state: State) => state.resetPasswordAlreadyUsed;
export const getResettingPasswordError = (state: State) => state.resetPasswordError;
export const getCheckingResetPasswordToken = (state: State) => state.checkingResetPasswordToken;
export const getCheckingResetPasswordTokenSuccess = (state: State) => state.checkResetPasswordTokenSuccess;
export const getPasswordMinimumLength = (state: State) => state.minimumLength;
export const getUsername = (state: State) => state.username;
