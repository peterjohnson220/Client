import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from 'libs/state/state';

import * as fromCustomSurveyTitleReducer from './custom-survey-title.reducer';
import * as fromCompanySelectorReducer from './company-selector.reducer';
import * as fromSurveyTitlesReducer from './survey-titles.reducer';
import * as fromSurveyReducer from './survey.reducer';

export interface SurveyLibraryState {
  customSurveyTitle: fromCustomSurveyTitleReducer.State;
  companySelector: fromCompanySelectorReducer.State;
  surveyTitles: fromSurveyTitlesReducer.State;
  surveyState: fromSurveyReducer.State;
}

export interface State extends fromRoot.State {
  survey_library: SurveyLibraryState;
}

export const reducers = {
  customSurveyTitle: fromCustomSurveyTitleReducer.reducer,
  companySelector: fromCompanySelectorReducer.reducer,
  surveyTitles: fromSurveyTitlesReducer.reducer,
  surveyState: fromSurveyReducer.reducer

};

export const selectSurveyLibraryState = createFeatureSelector<SurveyLibraryState>('survey_library');

export const selectCustomSurveyTitleState = createSelector(selectSurveyLibraryState,
  (state: SurveyLibraryState) => state.customSurveyTitle);
export const selectCompanySelectorState = createSelector(selectSurveyLibraryState,
  (state: SurveyLibraryState) => state.companySelector);
export const selectSurveyTitlesState = createSelector(selectSurveyLibraryState,
  (state: SurveyLibraryState) => state.surveyTitles);
export const selectSurveyState = createSelector(selectSurveyLibraryState,
  (state: SurveyLibraryState) => state.surveyState);

// Custom Survey Title area
export const getCustomSurveyTitleSaving = createSelector(selectCustomSurveyTitleState,
  fromCustomSurveyTitleReducer.getSavingCustomTitleSaving);

export const getCustomSurveyTitleSavingSuccess = createSelector(selectCustomSurveyTitleState,
  fromCustomSurveyTitleReducer.getSavingCustomTitleSavingSuccess);

export const getCustomSurveyTitleSavingError = createSelector(selectCustomSurveyTitleState,
  fromCustomSurveyTitleReducer.getSavingCustomTitleSavingError);

export const getSavedCustomTitleInfo = createSelector(selectCustomSurveyTitleState,
  fromCustomSurveyTitleReducer.getSavedInfo);

// Company selector area
export const getGettingCompanies = createSelector(selectCompanySelectorState,
  fromCompanySelectorReducer.getGettingCompanies);

export const getGettingCompaniesError = createSelector(selectCompanySelectorState,
  fromCompanySelectorReducer.getGettingCompaniesError);

export const getCompanies = createSelector(selectCompanySelectorState,
  fromCompanySelectorReducer.getCompanies);

// Survey titles area
export const getSavingSurveyTitles = createSelector(selectSurveyTitlesState,
  fromSurveyTitlesReducer.getSavingSurveyTitle);

export const getSavingSurveyTitlesSuccess = createSelector(selectSurveyTitlesState,
  fromSurveyTitlesReducer.getSavingSurveyTitleSuccess);

export const getSavingSurveyTitlesError = createSelector(selectSurveyTitlesState,
  fromSurveyTitlesReducer.getSavingSurveyTitleError);

export const getLoadingSurveyTitles = createSelector(selectSurveyTitlesState,
  fromSurveyTitlesReducer.getLoadingSurveyTitles);

export const getLoadingSurveyTitlesSuccess = createSelector(selectSurveyTitlesState,
  fromSurveyTitlesReducer.getLoadingSurveyTitlesSuccess);

export const getLoadingSurveyTitlesError = createSelector(selectSurveyTitlesState,
  fromSurveyTitlesReducer.getLoadingSurveyTitlesError);

export const getSurveyTitles = createSelector(selectSurveyTitlesState,
  fromSurveyTitlesReducer.getTitles);

export const getWarning = createSelector(selectSurveyTitlesState,
  fromSurveyTitlesReducer.getWarning);

// Survey Page
export const getSurveyData = createSelector(selectSurveyState, fromSurveyReducer.getSurveyData);
export const isLoadingSurveyData = createSelector(selectSurveyState, fromSurveyReducer.isLoadingSurveyData);
export const isMapCompaniesModalOpen = createSelector(selectSurveyState, fromSurveyReducer.isMapCompaniesModalOpen);
export const isCopySurveyModalOpen = createSelector(selectSurveyState, fromSurveyReducer.isCopySurveyModalOpen);
export const isDeleteConfirmationModalOpen = createSelector(selectSurveyState, fromSurveyReducer.isDeleteConfirmationModalOpen);
export const isLoadingMapModalData = createSelector(selectSurveyState, fromSurveyReducer.isLoadingMapModalData);
export const getMapModalDataFailed = createSelector(selectSurveyState, fromSurveyReducer.getMapModalDataFailed);
export const mapCompaniesModalData = createSelector(selectSurveyState, fromSurveyReducer.mapCompaniesModalData);
export const isAddSurveyModalOpen = createSelector(selectSurveyState, fromSurveyReducer.isAddSurveyModalOpen);
export const shouldRefreshGrid = createSelector(selectSurveyState, fromSurveyReducer.shouldRefreshGrid);
export const surveyLoadFailed = createSelector(selectSurveyState, fromSurveyReducer.surveyLoadFailed);

