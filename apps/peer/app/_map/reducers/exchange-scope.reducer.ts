import * as fromExchangeScopeActions from '../actions/exchange-scope.actions';

export interface State {
  upserting: boolean;
  upsertingError: boolean;
  saveModalOpen: boolean;
}

// Initial State
export const initialState: State = {
  upserting: false,
  upsertingError: false,
  saveModalOpen: false
};

// Reducer
export function reducer(
  state = initialState,
  action: fromExchangeScopeActions.Actions
): State {
  switch (action.type) {
    case fromExchangeScopeActions.UPSERT_EXCHANGE_SCOPE: {
      return {
        ...state,
        upserting: true,
        upsertingError: false
      };
    }
    case fromExchangeScopeActions.UPSERT_EXCHANGE_SCOPE_SUCCESS: {
      return {
        ...state,
        upserting: false,
        upsertingError: false,
        saveModalOpen: false
      };
    }
    case fromExchangeScopeActions.UPSERT_EXCHANGE_SCOPE_ERROR: {
      return {
        ...state,
        upserting: false,
        upsertingError: true
      };
    }
    case fromExchangeScopeActions.OPEN_SAVE_EXCHANGE_SCOPE_MODAL: {
      return {
        ...state,
        saveModalOpen: true
      };
    }
    case fromExchangeScopeActions.CLOSE_SAVE_EXCHANGE_SCOPE_MODAL: {
      return {
        ...state,
        saveModalOpen: false
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getUpserting = (state: State) => state.upserting;
export const getUpsertingError = (state: State) => state.upsertingError;
export const getSaveModalOpen = (state: State) => state.saveModalOpen;
