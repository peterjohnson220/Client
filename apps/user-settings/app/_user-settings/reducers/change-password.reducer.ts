import * as fromChangePasswordActions from '../actions/change-password.actions';

export interface State {
  changingPassword: boolean;
  changePasswordSuccess: boolean;
  changePasswordError: boolean;
  minimumLength: number;
}

export const initialState: State = {
  changingPassword: false,
  changePasswordSuccess: false,
  changePasswordError: false,
  minimumLength: 8
};

export function reducer(state = initialState, action: fromChangePasswordActions.Actions): State {
  switch (action.type) {
    case fromChangePasswordActions.CHANGE_PASSWORD: {
      return {
        ...state,
        changingPassword: true
      };
    }
    case fromChangePasswordActions.CHANGE_PASSWORD_SUCCESS: {
      return {
        ...state,
        changingPassword: false,
        changePasswordSuccess: true,
        changePasswordError: false
      };
    }
    case fromChangePasswordActions.CHANGE_PASSWORD_ERROR: {
      return {
        ...state,
        changingPassword: false,
        changePasswordError: true,
        changePasswordSuccess: false
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getChangingPassword = (state: State) => state.changingPassword;
export const getChangePasswordSuccess = (state: State) => state.changePasswordSuccess;
export const getChangePasswordError = (state: State) => state.changePasswordError;
export const getPasswordMinimumLength = (state: State) => state.minimumLength;
