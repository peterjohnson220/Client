import { CredentialsPackage, AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';

import * as fromProviderListActions from '../actions/provider-list.actions';
import { Provider, TransferMethod } from '../models';

export interface State {
    providers: AsyncStateObj<Provider[]>;
    selectedProvider: Provider;
    activeConnection: CredentialsPackage;
    transferMethods: AsyncStateObj<TransferMethod[]>;
    selectedTransferMethod: number;
  }

  export const initialState: State = {
    providers: generateDefaultAsyncStateObj<Provider[]>([]),
    selectedProvider: null,
    activeConnection: null,
    transferMethods: generateDefaultAsyncStateObj<TransferMethod[]>([]),
    selectedTransferMethod: null
  };


export function reducer(state: State = initialState, action: fromProviderListActions.Actions) {
    switch (action.type) {
      case fromProviderListActions.LOAD_PROVIDERS: {
        return AsyncStateObjHelper.loading(state, 'providers');
      }
      case fromProviderListActions.LOAD_PROVIDERS_ERROR: {
        return AsyncStateObjHelper.loadingError(state, 'providers');
      }
      case fromProviderListActions.LOAD_PROVIDERS_SUCCESS: {
        return AsyncStateObjHelper.loadingSuccess(state, 'providers', action.payload);
      }
      case fromProviderListActions.SET_SELECTED_PROVIDER: {
        return {
          ...state,
          selectedProvider: action.payload
        };
      }
      case fromProviderListActions.LOAD_TRANSFER_METHODS: {
        return AsyncStateObjHelper.loading(state, 'transferMethods');
      }
      case fromProviderListActions.LOAD_TRANSFER_METHODS_ERROR: {
        return AsyncStateObjHelper.loadingError(state, 'transferMethods');
      }
      case fromProviderListActions.LOAD_TRANSFER_METHODS_SUCCESS: {
        return AsyncStateObjHelper.loadingSuccess(state, 'transferMethods', action.payload);
      }
      case fromProviderListActions.SET_SELECTED_TRANSFER_METHOD: {
        return {
          ...state,
          selectedTransferMethod: action.payload
        };
      }
      default:
        return state;
    }
  }

export const getTransferMethods = (state: State) => state.transferMethods;
export const getSelectedTransferMethod = (state: State) => state.selectedTransferMethod;
export const getProviders = (state: State) => state.providers;
export const getSelectedProvider = (state: State) => state.selectedProvider;
export const getActiveConnection = (state: State) => state.activeConnection;
