import { ServiceAccountUser, ServiceAccountUserStatus } from 'libs/models';
import * as fromServiceAccountActions from '../actions';

export interface State {
  accountStatus: ServiceAccountUserStatus;
  accountStatusLoading: boolean;
  accountStatusLoadingError: boolean;
  creatingServiceAccount: boolean;
  creatingServiceAccountError: boolean;
  resettingServiceAccount: boolean;
  resettingServiceAccountError: boolean;
  serviceAccountUser: ServiceAccountUser;
  showResetAccountModal: boolean;
  showNewAccountModal: boolean;
}

export const initialState: State = {
  accountStatus: null,
  accountStatusLoading: false,
  accountStatusLoadingError: false,
  creatingServiceAccount: false,
  creatingServiceAccountError: false,
  resettingServiceAccount: false,
  resettingServiceAccountError: false,
  serviceAccountUser: null,
  showResetAccountModal: false,
  showNewAccountModal: false,
};

export function reducer(state = initialState, action: fromServiceAccountActions.Actions): State {
  switch (action.type) {
    case fromServiceAccountActions.CREATE_SERVICE_ACCOUNT: {
      return {
        ...state,
        accountStatus: null,
        creatingServiceAccount: true,
        creatingServiceAccountError: false,
      };
    }
    case fromServiceAccountActions.CREATE_SERVICE_ACCOUNT_SUCCESS: {
      return {
        ...state,
        creatingServiceAccount: false,
        creatingServiceAccountError: false,
        serviceAccountUser: action.payload,
      };
    }
    case fromServiceAccountActions.CREATE_SERVICE_ACCOUNT_ERROR: {
      return {
        ...state,
        creatingServiceAccount: false,
        creatingServiceAccountError: true,
      };
    }
    case fromServiceAccountActions.GET_ACCOUNT_STATUS: {
      return {
        ...state,
        accountStatusLoading: true,
        accountStatusLoadingError: false,
      };
    }
    case fromServiceAccountActions.GET_ACCOUNT_STATUS_SUCCESS: {
      return {
        ...state,
        accountStatus: action.payload,
        accountStatusLoading: false,
        accountStatusLoadingError: false,
      };
    }
    case fromServiceAccountActions.GET_ACCOUNT_STATUS_ERROR: {
      return {
        ...state,
        accountStatusLoading: false,
        accountStatusLoadingError: true,
      };
    }
    case fromServiceAccountActions.CLOSE_RESET_ACCOUNT_MODAL: {
      return {
        ...state,
        showResetAccountModal: false,
      };
    }
    case fromServiceAccountActions.OPEN_RESET_ACCOUNT_MODAL: {
      return {
        ...state,
        showResetAccountModal: true,
      };
    }
    case fromServiceAccountActions.CLOSE_NEW_ACCOUNT_MODAL: {
      return {
        ...state,
        showNewAccountModal: false,
      };
    }
    case fromServiceAccountActions.OPEN_NEW_ACCOUNT_MODAL: {
      return {
        ...state,
        showNewAccountModal: true,
      };
    }
    case fromServiceAccountActions.RESET_SERVICE_ACCOUNT: {
      return {
        ...state,
        resettingServiceAccount: true,
        resettingServiceAccountError: false,
      };
    }
    case fromServiceAccountActions.RESET_SERVICE_ACCOUNT_SUCCESS: {
      return {
        ...state,
        resettingServiceAccount: false,
        resettingServiceAccountError: false,
        serviceAccountUser: action.payload,
      };
    }
    case fromServiceAccountActions.RESET_SERVICE_ACCOUNT_ERROR: {
      return {
        ...state,
        resettingServiceAccount: false,
        resettingServiceAccountError: true,
      };
    }

    default:
      return state;
  }
}

export const GetAccountStatus = (state: State) => state.accountStatus;
export const GetAccountStatusLoading = (state: State) => state.accountStatusLoading;
export const GetAccountStatusLoadingError = (state: State) => state.accountStatusLoadingError;
export const GetCreatingServiceAccount = (state: State) => state.creatingServiceAccount;
export const GetCreatingServiceAccountError = (state: State) => state.creatingServiceAccountError;
export const GetResettingServiceAccount = (state: State) => state.resettingServiceAccount;
export const GetResettingServiceAccountError = (state: State) => state.resettingServiceAccountError;
export const GetServiceAccountUser = (state: State) => state.serviceAccountUser;
export const OpenResetAccountModal = (state: State) => state.showResetAccountModal;
export const OpenNewAccountModal = (state: State) => state.showNewAccountModal;
