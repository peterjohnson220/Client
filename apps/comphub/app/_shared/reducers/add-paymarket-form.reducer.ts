import * as fromAddPayMarketFormActions from '../actions/add-paymarket-form.actions';

export interface State {
  formOpen: boolean;
  infoBannerOpen: boolean;
  saving: boolean;
  savingConflict: boolean;
  savingError: boolean;
  showSkipButton: boolean;
}

const initialState: State = {
  formOpen: false,
  infoBannerOpen: false,
  saving: false,
  savingConflict: false,
  savingError: false,
  showSkipButton: false
};

export function reducer(state = initialState, action: fromAddPayMarketFormActions.Actions): State {
  switch (action.type) {
    case fromAddPayMarketFormActions.OPEN_FORM: {
      const showSkipButton = (!!action.payload) ? action.payload.showSkipButton : false;
      return {
        ...state,
        formOpen: true,
        showSkipButton: showSkipButton
      };
    }
    case fromAddPayMarketFormActions.CLOSE_FORM: {
      return {
        ...state,
        formOpen: false
      };
    }
    case fromAddPayMarketFormActions.SAVE_PAYMARKET: {
      return {
        ...state,
        saving: true
      };
    }
    case fromAddPayMarketFormActions.SAVE_PAYMARKET_SUCCESS: {
      return {
        ...state,
        saving: false,
        savingConflict: false,
        savingError: false
      };
    }
    case fromAddPayMarketFormActions.SAVE_PAYMARKET_CONFLICT: {
      return {
        ...state,
        saving: false,
        savingConflict: true
      };
    }
    case fromAddPayMarketFormActions.SAVE_PAYMARKET_ERROR: {
      return {
        ...state,
        saving: false,
        savingError: true
      };
    }
    case fromAddPayMarketFormActions.CLEAR_SAVE_ERROR: {
      return {
        ...state,
        savingConflict: false,
        savingError: false
      };
    }
    case fromAddPayMarketFormActions.OPEN_INFO_BANNER: {
      return {
        ...state,
        infoBannerOpen: true
      };
    }
    case fromAddPayMarketFormActions.CLOSE_INFO_BANNER: {
      return {
        ...state,
        infoBannerOpen: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getFormOpen = (state: State) => state.formOpen;
export const getSaving = (state: State) => state.saving;
export const getSavingConflict = (state: State) => state.savingConflict;
export const getSavingError = (state: State) => state.savingError;
export const getInfoBannerOpen = (state: State) => state.infoBannerOpen;
export const getShowSkipButton = (state: State) => state.showSkipButton;
