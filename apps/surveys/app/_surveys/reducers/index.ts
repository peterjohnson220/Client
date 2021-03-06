import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducers
import * as fromRoot from 'libs/state/state';

import * as fromSurveysPageReducer from './surveys-page.reducer';
import * as fromSurveyParticipationReducer from './survey-participation.reducer';

// Feature area state
export interface SurveysMainState {
  surveysPage: fromSurveysPageReducer.State;
  surveyParticipation: fromSurveyParticipationReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  surveys_main: SurveysMainState;
}

// Feature area reducers
export const reducers = {
  surveysPage: fromSurveysPageReducer.reducer,
  surveyParticipation: fromSurveyParticipationReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<SurveysMainState>('surveys_main');

// Feature Selectors
export const selectSurveysPageState = createSelector(selectFeatureAreaState,
  (state: SurveysMainState) => state.surveysPage
);

export const selectSurveyParticipationState = createSelector(selectFeatureAreaState,
  (state: SurveysMainState) => state.surveyParticipation);

// Surveys Page
export const getSurveyFieldsModalOpen = createSelector(selectSurveysPageState, fromSurveysPageReducer.getSurveyFieldsModalOpen);
export const getParticipantsModalOpen = createSelector(selectSurveysPageState, fromSurveysPageReducer.getParticipantsModalOpen);
export const getSurveyParticipants = createSelector(selectSurveysPageState, fromSurveysPageReducer.getSurveyParticipants);
export const getSurveyCountries = createSelector(selectSurveysPageState, fromSurveysPageReducer.getSurveyCountries);
export const getSurveyYears = createSelector(selectSurveysPageState, fromSurveysPageReducer.getSurveyYears);
export const getOpenedSurveyDataGrids = createSelector(selectSurveysPageState, fromSurveysPageReducer.getOpenedSurveyDataGrids);
export const getSurveyJobDetails = createSelector(selectSurveysPageState, fromSurveysPageReducer.getSurveyJobDetails);


// Survey Participation Modal
export const getSurveyInfo = createSelector(selectSurveyParticipationState, fromSurveyParticipationReducer.getSurveyInfo);
export const getSurveyParticipationModalOpen = createSelector(selectSurveyParticipationState, fromSurveyParticipationReducer.getSurveyParticipationModalOpen);
