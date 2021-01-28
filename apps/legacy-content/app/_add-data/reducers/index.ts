import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromAddSurveyDataPageReducer from './add-survey-data-page.reducer';
import { SharedState } from 'libs/features/surveys/survey-search/reducers';

// Feature area state
export interface AddDataState extends SharedState {
  addSurveyDataPage: fromAddSurveyDataPageReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  project_addData: AddDataState;
}

// Feature area reducers
export const reducers = {
  addSurveyDataPage: fromAddSurveyDataPageReducer.reducer,
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<AddDataState>('project_addData');

// Feature Selectors
export const selectAddSurveyDataPageState = createSelector(
  selectFeatureAreaState,
  (state: AddDataState) => state.addSurveyDataPage
);

export const getAddingData = createSelector(
  selectAddSurveyDataPageState,
  fromAddSurveyDataPageReducer.getAddingData
);
