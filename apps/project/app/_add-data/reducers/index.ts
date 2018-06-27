import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromAddSurveyDataPageReducer from './add-survey-data-page.reducer';
import * as fromSearchResultsReducer from './search-results.reducer';

// Feature area state
export interface AddDataState {
  addSurveyDataPage: fromAddSurveyDataPageReducer.State;
  searchResults: fromSearchResultsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  project_addData: AddDataState;
}

// Feature area reducers
export const reducers = {
  addSurveyDataPage: fromAddSurveyDataPageReducer.reducer,
  searchResults: fromSearchResultsReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<AddDataState>('project_addData');

// Feature Selectors
export const selectAddSurveyDataPageState = createSelector(
  selectFeatureAreaState,
  (state: AddDataState) => state.addSurveyDataPage
);

export const selectSearchResultsState = createSelector(
  selectFeatureAreaState,
  (state: AddDataState) => state.searchResults
);

// Add Survey Data Page Selectors
export const getLoadingDefaultSurveyScopes = createSelector(
  selectAddSurveyDataPageState,
  fromAddSurveyDataPageReducer.getLoadingDefaultSurveyScopes
);

export const getFilters = createSelector(
  selectAddSurveyDataPageState,
  fromAddSurveyDataPageReducer.getFilters
);

export const getJobContext = createSelector(
  selectAddSurveyDataPageState,
  fromAddSurveyDataPageReducer.getJobContext
);

// Search Results Selectors
export const getResults = createSelector(
  selectSearchResultsState,
  fromSearchResultsReducer.getResults
);

export const getLoadingResults = createSelector(
  selectSearchResultsState,
  fromSearchResultsReducer.getLoadingResults
);

export const getLoadingMoreResults = createSelector(
  selectSearchResultsState,
  fromSearchResultsReducer.getLoadingMoreResults
);
