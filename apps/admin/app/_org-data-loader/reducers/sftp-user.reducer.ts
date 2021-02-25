import { SftpUserModel } from 'libs/models/Sftp';

import * as fromSftpUserActions from '../actions/sftp-user.actions';

export interface State {
  sftpUser: SftpUserModel;
  userName: string;
  publicKey: File;
  loading: boolean;
  loadingError: boolean;
  validatingUserName: boolean;
  validatingUserNameError: boolean;
  isUserNameValid: boolean;
  isDeletingSftpCreds: boolean;
  deleteSftpCredsError: boolean;
  deleteSftpCredsSuccess: boolean;
}

const initialState: State = {
  sftpUser: null,
  userName: null,
  publicKey: null,
  loading: false,
  loadingError: false,
  validatingUserName: false,
  validatingUserNameError: false,
  isUserNameValid: null,
  isDeletingSftpCreds: false,
  deleteSftpCredsError: false,
  deleteSftpCredsSuccess: false
};

export function reducer(state = initialState, action: fromSftpUserActions.Actions): State {
  switch (action.type) {
    case fromSftpUserActions.SET_SFTP_USERNAME: {
      return {
        ...state,
        userName: action.payload
      };
    }
    case fromSftpUserActions.SET_SFTP_PUBLIC_KEY: {
      return {
        ...state,
        publicKey: action.payload
      };
    }
    case fromSftpUserActions.GET_SFTP_USER: {
      return {
        ...state,
        loading: true
      };
    }
    case fromSftpUserActions.GET_SFTP_USER_SUCCESS: {
      return {
        ...state,
        loading: false,
        sftpUser: action.payload
      };
    }
    case fromSftpUserActions.GET_SFTP_USER_Error: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromSftpUserActions.VALIDATE_USERNAME: {
      return {
        ...state,
        validatingUserName: true,
        validatingUserNameError: false,
        isUserNameValid: null
      };
    }
    case fromSftpUserActions.VALIDATE_USERNAME_SUCCESS: {
      return {
        ...state,
        validatingUserName: false,
        isUserNameValid: action.payload.Valid
      };
    }
    case fromSftpUserActions.VALIDATE_USERNAME_ERROR: {
      return {
        ...state,
        validatingUserName: false,
        validatingUserNameError: true
      };
    }
    case fromSftpUserActions.DELETE_SFTP_CREDENTIALS: {
      return {
        ...state,
        isDeletingSftpCreds: true,
        deleteSftpCredsSuccess: false
      };
    }
    case fromSftpUserActions.DELETE_SFTP_CREDENTIALS_SUCCESS: {
      return {
        ...state,
        isDeletingSftpCreds: false,
        deleteSftpCredsSuccess: true
      };
    }
    case fromSftpUserActions.DELETE_SFTP_CREDENTIALS_ERROR: {
      return {
        ...state,
        isDeletingSftpCreds: false,
        deleteSftpCredsError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getSftpUser = (state: State) => state.sftpUser;
export const getSftpUserName = (state: State) => state.userName;
export const getSftpPublicKey = (state: State) => state.publicKey;
export const getLoadingSftpUser = (state: State) => state.loading;
export const getLoadingSftpUserError = (state: State) => state.loadingError;
export const getValidatingUserName = (state: State) => state.validatingUserName;
export const getValidatingUserNameError = (state: State) => state.validatingUserNameError;
export const getIsUserNameValid = (state: State) => state.isUserNameValid;
export const getIsDeleteingSftpCreds = (state: State) => state.isDeletingSftpCreds;
export const getDeleteSftpCredsSuccess = (state: State) => state.deleteSftpCredsSuccess;
export const getDeleteSftpCredsError = (state: State) => state.deleteSftpCredsError;
