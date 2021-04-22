import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducers
import * as fromRoot from 'libs/state/state';

import * as fromSurveysPageReducer from './surveys-page.reducer';

// Feature area state
export interface SurveysMainState {
  surveysPage: fromSurveysPageReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  surveys_main: SurveysMainState;
}

// Feature area reducers
export const reducers = {
  surveysPage: fromSurveysPageReducer.reducer,
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<SurveysMainState>('surveys_main');

// Feature Selectors
export const selectSurveysPageState = createSelector(selectFeatureAreaState,
  (state: SurveysMainState) => state.surveysPage
);

// Surveys Page
