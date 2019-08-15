import * as fromSurveyTitleActions from '../actions';

export interface State {
  saving: boolean;
  savingSuccess: boolean;
  savingError: boolean;
}

export const initialState: State = {
  saving: false,
  savingSuccess: false,
  savingError: false
};

export function reducer(state = initialState, action: fromSurveyTitleActions.Actions): State {
  switch (action.type) {
    case fromSurveyTitleActions.SAVE_CUSTOM_TITLE: {
      return {
        ...state,
        saving: true,
        savingSuccess: false,
        savingError: false
      };
    }
    case fromSurveyTitleActions.SAVE_CUSTOM_TITLE_SUCCESS: {
      return {
        ...state,
        saving: false,
        savingSuccess: true,
        savingError: false
      };
    }
    case fromSurveyTitleActions.SAVE_CUSTOM_TITLE_ERROR: {
      return {
        ...state,
        saving: false,
        savingSuccess: false,
        savingError: true
      };
    }
    default:
      return state;
  }
}

export const getSavingCustomTitleSaving = (state: State) => state.saving;
export const getSavingCustomTitleSavingSuccess = (state: State) => state.savingSuccess;
export const getSavingCustomTitleSavingError = (state: State) => state.savingError;
