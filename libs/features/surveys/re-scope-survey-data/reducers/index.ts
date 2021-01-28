import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromReScopeReducer from './re-scope-survey-data.reducer';

// Feature area state
export interface ReScopeSurveyDataState {
  reScopeSurveyData: fromReScopeReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_reScopeSurveyData: ReScopeSurveyDataState;
}

// Feature area reducers
export const reducers = {
  reScopeSurveyData: fromReScopeReducer.reducer
};

// Select Feature Area
export const selectReScopeFeature =
  createFeatureSelector<ReScopeSurveyDataState>('feature_reScopeSurveyData');

// View Selectors
export const selectReScopeState =
  createSelector(selectReScopeFeature, (state: ReScopeSurveyDataState) => state.reScopeSurveyData);

export const getReScopeContext = createSelector(selectReScopeState, fromReScopeReducer.getReScopeContext);
