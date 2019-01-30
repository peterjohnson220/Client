import * as fromAddPayMarketModalActions from '../actions/add-paymarket-modal.actions';

export interface State {
  modalOpen: boolean;
  saving: boolean;
  savingConflict: boolean;
  savingError: boolean;
}

const initialState: State = {
  modalOpen: false,
  saving: false,
  savingConflict: false,
  savingError: false
};

export function reducer(state = initialState, action: fromAddPayMarketModalActions.Actions): State {
  switch (action.type) {
    case fromAddPayMarketModalActions.OPEN_MODAL: {
      return {
        ...state,
        modalOpen: true
      };
    }
    case fromAddPayMarketModalActions.CLOSE_MODAL: {
      return {
        ...state,
        modalOpen: false
      };
    }
    case fromAddPayMarketModalActions.SAVE_PAYMARKET: {
      return {
        ...state,
        saving: true
      };
    }
    case fromAddPayMarketModalActions.SAVE_PAYMARKET_SUCCESS: {
      return {
        ...state,
        saving: false,
        savingConflict: false,
        savingError: false
      };
    }
    case fromAddPayMarketModalActions.SAVE_PAYMARKET_CONFLICT: {
      return {
        ...state,
        saving: false,
        savingConflict: true
      };
    }
    case fromAddPayMarketModalActions.SAVE_PAYMARKET_ERROR: {
      return {
        ...state,
        saving: false,
        savingError: true
      };
    }
    case fromAddPayMarketModalActions.CLEAR_SAVE_ERROR: {
      return {
        ...state,
        savingConflict: false,
        savingError: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getModalOpen = (state: State) => state.modalOpen;
export const getSaving = (state: State) => state.saving;
export const getSavingConflict = (state: State) => state.savingConflict;
export const getSavingError = (state: State) => state.savingError;
