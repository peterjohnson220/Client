import * as fromTransferDataPageActions from '../actions/transfer-data-page.actions';
import { TransferMethod, Provider } from '../models';
import { LoadingError } from 'apps/jobs/app/_matches-modal/actions/matches.actions';


export interface State {
  loading: boolean;
  loadingError: boolean;
  transferMethods: TransferMethod[];
  providers: Provider[];
  selectedTransferMethod: number;
  selectedProvider: number;
}

const initialState: State = {
  loading: true,
  loadingError: false,
  transferMethods: null,
  providers: null,
  selectedTransferMethod: null,
  selectedProvider: null,
};

export function reducer(state: State = initialState, action: fromTransferDataPageActions.Actions) {
  switch (action.type) {
    case fromTransferDataPageActions.LOAD_TRANSFER_METHODS_ERROR:
    case fromTransferDataPageActions.LOAD_PROVIDERS_ERROR: {
      return {
        ...state,
          LoadingError: true
      };
    }
    case fromTransferDataPageActions.LOAD_TRANSFER_METHODS_SUCCESS: {
      return {
        ...state,
        transferMethods: action.payload
      };
    }
    case fromTransferDataPageActions.LOAD_PROVIDERS_SUCCESS: {
      return {
        ...state,
        loading: false,
        providers: action.payload
      };
    }
    case fromTransferDataPageActions.SET_SELECTED_TRANSFER_METHOD: {
      return {
        ...state,
        selectedTransferMethod: action.payload
      };
    }
    case fromTransferDataPageActions.SET_SELECTED_PROVIDER: {
      return {
        ...state,
        selectedProvider: action.payload
      };
    }
    case fromTransferDataPageActions.RESET_TRANSFER_DATA_PAGE_WORKFLOW: {
      return {
        ...state,
        selectedProvider: null,
      };
    }
    default:
      return state;
  }
}

export const getTransferMethods = (state: State) => state.transferMethods;
export const getProviders = (state: State) => state.providers;
export const getSelectedTransferMethod = (state: State) => state.selectedTransferMethod;
export const getSelectedProvider = (state: State) => state.selectedProvider;
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
