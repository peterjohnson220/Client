import * as fromSurveyTitleActions from '../actions/survey-titles.actions';

export interface State {
  saving: boolean;
  savingSuccess: boolean;
  savingError: boolean;
  savedCompanyId: number;
  savedTitleId: number;
}

export const initialState: State = {
  saving: false,
  savingSuccess: false,
  savingError: false,
  savedCompanyId: null,
  savedTitleId: null
};

export function reducer(state = initialState, action: fromSurveyTitleActions.Actions): State {
  switch (action.type) {
    case fromSurveyTitleActions.SAVE_CUSTOM_TITLE: {
      return {
        ...state,
        saving: true,
        savingSuccess: false,
        savingError: false,
        savedCompanyId: null,
        savedTitleId: null
      };
    }
    case fromSurveyTitleActions.SAVE_CUSTOM_TITLE_SUCCESS: {
      return {
        ...state,
        saving: false,
        savingSuccess: true,
        savingError: false,
        savedCompanyId: action.companyId,
        savedTitleId: action.titleId
      };
    }
    case fromSurveyTitleActions.SAVE_CUSTOM_TITLE_ERROR: {
      return {
        ...state,
        saving: false,
        savingSuccess: false,
        savingError: true,
        savedCompanyId: null,
        savedTitleId: null
      };
    }
    default:
      return state;
  }
}

export const getSavingCustomTitleSaving = (state: State) => state.saving;
export const getSavingCustomTitleSavingSuccess = (state: State) => state.savingSuccess;
export const getSavingCustomTitleSavingError = (state: State) => state.savingError;
export const getSavedInfo = (state: State) => {return {
  companyId: state.savedCompanyId,
  titleId: state.savedTitleId
  };
};
