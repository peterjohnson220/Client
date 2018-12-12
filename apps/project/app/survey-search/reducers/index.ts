import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromSurveySearchResultsReducer from './survey-search-results.reducer';
import * as fromTooltipContainerReducer from './tooltip-container.reducer';
import * as fromContextReducer from './context.reducer';

// Feature area state
export interface SharedProjectState {
  surveySearchResults: fromSurveySearchResultsReducer.State;
  tooltipContainer: fromTooltipContainerReducer.State;
  context: fromContextReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  project_surveySearch: SharedProjectState;
}

// Feature area reducers
export const reducers = {
  surveySearchResults: fromSurveySearchResultsReducer.reducer,
  tooltipContainer: fromTooltipContainerReducer.reducer,
  context: fromContextReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<SharedProjectState>('project_surveySearch');

// Feature Selectors
export const selectSearchResultsState = createSelector(
  selectFeatureAreaState,
  (state: SharedProjectState) => state.surveySearchResults
);

export const selectTooltipContainerState = createSelector(
  selectFeatureAreaState,
  (state: SharedProjectState) => state.tooltipContainer
);

export const selectContextState = createSelector(
  selectFeatureAreaState,
  (state: SharedProjectState) => state.context
);

// Context
export const getProjectSearchContext = createSelector(
  selectContextState,
  fromContextReducer.getProjectSearchContext
);

export const getJobContext = createSelector(
  selectContextState,
  fromContextReducer.getJobContext
);

// Search Results Selectors
export const getResults = createSelector(
  selectSearchResultsState,
  fromSurveySearchResultsReducer.getResults
);

export const getSelectedDataCuts = createSelector(
  selectSearchResultsState,
  fromSurveySearchResultsReducer.getSelectedDataCuts
);

// Tooltip Container Selectors
export const getLoadingMatchesDetails = createSelector(
  selectTooltipContainerState,
  fromTooltipContainerReducer.getLoadingMatchesDetails
);

export const getMatchesDetails = createSelector(
  selectTooltipContainerState,
  fromTooltipContainerReducer.getMatchesDetails
);

export const getMatchesDetailsTooltipOpen = createSelector(
  selectTooltipContainerState,
  fromTooltipContainerReducer.getMatchesDetailsTooltipOpen
);

