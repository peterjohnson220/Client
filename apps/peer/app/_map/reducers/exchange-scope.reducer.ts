import * as fromExchangeScopeActions from '../actions/exchange-scope.actions';

export interface State {
  saveModalOpen: boolean;
}

// Initial State
export const initialState: State = {
  saveModalOpen: false
};

// Reducer
export function reducer(
  state = initialState,
  action: fromExchangeScopeActions.Actions
): State {
  switch (action.type) {
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
export const getSaveModalOpen = (state: State) => state.saveModalOpen;
