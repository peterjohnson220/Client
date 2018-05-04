import * as fromForgotPasswordActions from '../actions/forgot-password.actions';

export interface State {
  sendingPasswordReset: boolean;
  sendingPasswordResetSuccess: boolean;
  sendingPasswordResetError: boolean;
}

export const initialState: State = {
  sendingPasswordReset: false,
  sendingPasswordResetSuccess: false,
  sendingPasswordResetError: false,
};

export function reducer(state = initialState, action: fromForgotPasswordActions.Actions): State {
  switch (action.type) {
    case fromForgotPasswordActions.SENDING_PASSWORD_RESET: {
      return {
        ...state,
        sendingPasswordReset: true,
        sendingPasswordResetError: false,
      };
    }
    case fromForgotPasswordActions.SENDING_PASSWORD_RESET_SUCCESS: {
      return {
        ...state,
        sendingPasswordReset: false,
        sendingPasswordResetSuccess: true
      };
    }
    case fromForgotPasswordActions.SENDING_PASSWORD_RESET_ERROR: {
      return {
        ...state,
        sendingPasswordReset: false,
        sendingPasswordResetError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getSendingPassword = (state: State) => state.sendingPasswordReset;
export const getSendingPasswordSuccess = (state: State) => state.sendingPasswordResetSuccess;
export const getSendingPasswordResetError = (state: State) => state.sendingPasswordResetError;
