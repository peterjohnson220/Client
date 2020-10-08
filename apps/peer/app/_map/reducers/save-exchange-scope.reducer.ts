import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { GenericKeyValue, GenericMenuItem } from 'libs/models/common';

import * as fromSaveExchangeScopeActions from '../actions/save-exchange-scope.actions';

export interface State {
  saveModalOpen: boolean;
  parentPayMarketOptions: AsyncStateObj<GenericKeyValue<number, string>[]>;
}

// Initial State
export const initialState: State = {
  saveModalOpen: false,
  parentPayMarketOptions: generateDefaultAsyncStateObj<GenericKeyValue<number, string>[]>([])
};

// Reducer
export function reducer(
  state = initialState,
  action: fromSaveExchangeScopeActions.Actions
): State {
  switch (action.type) {
    case fromSaveExchangeScopeActions.OPEN_SAVE_EXCHANGE_SCOPE_MODAL: {
      return {
        ...state,
        saveModalOpen: true
      };
    }
    case fromSaveExchangeScopeActions.CLOSE_SAVE_EXCHANGE_SCOPE_MODAL: {
      return {
        ...state,
        saveModalOpen: false
      };
    }
    case fromSaveExchangeScopeActions.LOAD_PARENT_PAYMARKETS: {
      return AsyncStateObjHelper.loading(state, 'parentPayMarketOptions');
    }
    case fromSaveExchangeScopeActions.LOAD_PARENT_PAYMARKETS_SUCCESS: {
      const parentPayMarketOptions = action.payload ?? [];
      return AsyncStateObjHelper.loadingSuccess(state, 'parentPayMarketOptions', parentPayMarketOptions);
    }
    case fromSaveExchangeScopeActions.LOAD_PARENT_PAYMARKETS_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'parentPayMarketOptions');
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getSaveModalOpen = (state: State) => state.saveModalOpen;
export const getParentPayMarketOptions = (state: State) => state.parentPayMarketOptions.obj;
export const getParentPayMarketOptionsLoading = (state: State) => state.parentPayMarketOptions.loading;
