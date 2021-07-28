import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromSurveyLoaderReducer from './survey-loader.reducers';
import * as fromUploadSurveyFileReducer from './upload-survey-file.reducer';


// Feature area state
export interface SurveyLoaderMainState {
  surveyLoader: fromSurveyLoaderReducer.State;
  uploadSurveyFile: fromUploadSurveyFileReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  surveyloader_main: SurveyLoaderMainState;
}

// Feature area reducers
export const reducers = {
  surveyLoader: fromSurveyLoaderReducer.reducer,
  uploadSurveyFile: fromUploadSurveyFileReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<SurveyLoaderMainState>('surveyloader_main');

// Feature Selectors
export const selectUploadSurveyFileState = createSelector(
  selectFeatureAreaState,
  (state: SurveyLoaderMainState) => state.uploadSurveyFile
);
export const selectSurveyLoaderState = createSelector(selectFeatureAreaState, (state: SurveyLoaderMainState) => state.surveyLoader);

// Survey Loader
export const getConfigGroup = createSelector(selectSurveyLoaderState, fromSurveyLoaderReducer.getConfigGroup);
export const getEmailRecipient = createSelector(selectSurveyLoaderState, fromSurveyLoaderReducer.getEmailRecipient);
export const getProcessing = createSelector(selectSurveyLoaderState, fromSurveyLoaderReducer.getProcessing);
export const getProcessingSuccess = createSelector(selectSurveyLoaderState, fromSurveyLoaderReducer.getProcessingSuccess);
export const getProcessingError = createSelector(selectSurveyLoaderState, fromSurveyLoaderReducer.getProcessingError);
export const getErrorMessage = createSelector(selectSurveyLoaderState, fromSurveyLoaderReducer.getErrorMessage);
export const getSavingConfigGroupSuccess = createSelector(selectSurveyLoaderState, fromSurveyLoaderReducer.getSavingConfigGroupSuccess);


// Upload Survey File
export const getWorksheetNames = createSelector(selectUploadSurveyFileState, fromUploadSurveyFileReducer.getWorksheetNames);
export const getFileUploadSettings = createSelector(selectUploadSurveyFileState, fromUploadSurveyFileReducer.getFileUploadSettings);
export const getSurveyJobSheetName = createSelector(selectUploadSurveyFileState, fromUploadSurveyFileReducer.getSurveyJobSheetName);
export const getSurveyDataSheetName = createSelector(selectUploadSurveyFileState, fromUploadSurveyFileReducer.getSurveyDataSheetName);
export const getSurveyParticipantsSheetName = createSelector(selectUploadSurveyFileState, fromUploadSurveyFileReducer.getSurveyParticipantsSheetName);
export const getValidationOnly = createSelector(selectUploadSurveyFileState, fromUploadSurveyFileReducer.getValidationOnly);
