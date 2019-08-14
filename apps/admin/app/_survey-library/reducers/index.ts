import * as fromRoot from 'libs/state/state';
import * as fromCustomSurveyTitleReducer from './custom-survey-title.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface SurveyLibraryState {
  customSurveyTitle: fromCustomSurveyTitleReducer.State;
}

export interface State extends fromRoot.State {
  surveyLibrary: SurveyLibraryState;
}

export const reducers = {
  customSurveyTitle: fromCustomSurveyTitleReducer.reducer
};

export const selectSurveyLibraryState = createFeatureSelector<SurveyLibraryState>('survey_library');

export const selectCustomSurveyTitleState = createSelector(selectSurveyLibraryState,
  (state: SurveyLibraryState) => state.customSurveyTitle);

// Custom Survey Title area
export const getCustomSurveyTitleSaving = createSelector(selectCustomSurveyTitleState,
  fromCustomSurveyTitleReducer.getSavingCustomTitleSaving);

export const getCustomSurveyTitleSavingSuccess = createSelector(selectCustomSurveyTitleState,
  fromCustomSurveyTitleReducer.getSavingCustomTitleSavingSuccess);

export const getCustomSurveyTitleSavingError = createSelector(selectCustomSurveyTitleState,
  fromCustomSurveyTitleReducer.getSavingCustomTitleSavingError);
