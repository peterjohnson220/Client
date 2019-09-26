import * as fromSurveyTitleActions from '../actions/survey-titles.actions';
import { SurveyTitleResponseModel } from '../models';
import { SurveyLibraryConstants } from '../constants/survey-library-constants';

export interface State {
  loading: boolean;
  loadingSuccess: boolean;
  loadingError: boolean;
  saving: boolean;
  savingSuccess: boolean;
  savingError: boolean;
  titles: SurveyTitleResponseModel;
  warning: string;
}

export const initialState: State = {
  loading: false,
  loadingSuccess: false,
  loadingError: false,
  saving: false,
  savingSuccess: false,
  savingError: false,
  titles: null,
  warning: ''
};

export function reducer(state = initialState, action: fromSurveyTitleActions.Actions): State {
  switch (action.type) {
    case fromSurveyTitleActions.SAVE_SURVEY_TITLE: {
      return {
        ...state,
        saving: true,
        savingSuccess: false,
        savingError: false,
        warning: ''
      };
    }
    case fromSurveyTitleActions.SAVE_SURVEY_TITLE_SUCCESS: {
      return {
        ...state,
        saving: false,
        savingSuccess: true,
        savingError: false
      };
    }
    case fromSurveyTitleActions.SAVE_SURVEY_TITLE_ERROR: {
      return {
        ...state,
        saving: false,
        savingSuccess: false,
        savingError: true
      };
    }
    case fromSurveyTitleActions.LOADING_SURVEY_TITLES: {
      return {
        ...state,
        loading: true,
        loadingSuccess: false,
        loadingError: false
      };
    }
    case fromSurveyTitleActions.LOADING_SURVEY_TITLES_SUCCESS: {
      return {
        ...state,
        loading: false,
        loadingSuccess: true,
        loadingError: false,
        titles: action.payload
      };
    }
    case fromSurveyTitleActions.LOADING_SURVEY_TITLES_ERROR: {
      return {
        ...state,
        loading: false,
        loadingSuccess: false,
        loadingError: true
      };
    }
    case fromSurveyTitleActions.TITLE_CODE_EXISTS: {
      return {
        ...state,
        saving: false,
        savingSuccess: false,
        savingError: true,
        warning: SurveyLibraryConstants.DUPLICATE_SURVEY_CODE_ERROR
      };
    }
    default:
      return state;
  }
}

export const getSavingSurveyTitle = (state: State) => state.saving;
export const getSavingSurveyTitleSuccess = (state: State) => state.savingSuccess;
export const getSavingSurveyTitleError = (state: State) => state.savingError;
export const getLoadingSurveyTitles = (state: State) => state.loading;
export const getLoadingSurveyTitlesSuccess = (state: State) => state.loadingSuccess;
export const getLoadingSurveyTitlesError = (state: State) => state.loadingError;
export const getTitles = (state: State) => state.titles;
export const getWarning = (state: State) => state.warning;
