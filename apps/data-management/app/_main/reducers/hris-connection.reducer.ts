import {CredentialsPackage} from 'libs/models/hris-api/connection/request';

import * as fromHrisConnectionActions from '../actions/hris-connection.actions';

export interface State {
  loading: boolean;
  loadingError: boolean;
  activeConnection: CredentialsPackage;
  saving: boolean;
  savingError: boolean;
  deleteCompleted: boolean;
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  activeConnection: null,
  saving: false,
  savingError: false,
  deleteCompleted: null
};

export function reducer(state: State = initialState, action: fromHrisConnectionActions.Actions) {
  switch (action.type) {
    case fromHrisConnectionActions.GET_CURRENT_HRIS_CONNECTION: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromHrisConnectionActions.GET_CURRENT_HRIS_CONNECTION_SUCCESS: {
      return {
        ...state,
        loading: false,
        loadingError: false,
        activeConnection: action.payload
      };
    }
    case fromHrisConnectionActions.GET_CURRENT_HRIS_CONNECTION_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromHrisConnectionActions.DELETE_HRIS_CONNECTION: {
      return {
        ...state,
        saving: true,
        savingError: false
      };
    }
    case fromHrisConnectionActions.DELETE_HRIS_CONNECTION_SUCCESS: {
      return {
        ...state,
        saving: false,
        savingError: false,
        deleteCompleted: true
      };
    }
    case fromHrisConnectionActions.DELETE_HRIS_CONNECTION_ERROR: {
      return {
        ...state,
        saving: false,
        savingError: true
      };
    }
    default:
      return state;
  }
}

export const getConnection = (state: State) => state.activeConnection;
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getSaving = (state: State) => state.saving;
export const getSavingError = (state: State) => state.savingError;
export const getDeleteCompleted = (state: State) => state.deleteCompleted;
