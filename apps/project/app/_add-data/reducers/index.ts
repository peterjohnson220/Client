import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromAddSurveyDataPageReducer from './add-survey-data-page.reducer';
import * as fromSearchResultsReducer from './search-results.reducer';
import * as fromSearchFiltersReducer from './search-filters.reducer';
import * as fromSingledFilterReducer from './singled-filter.reducer';
import * as fromTooltipContainerReducer from './tooltip-container.reducer';
import { MultiSelectFilter } from '../models';

// Feature area state
export interface AddDataState {
  addSurveyDataPage: fromAddSurveyDataPageReducer.State;
  searchResults: fromSearchResultsReducer.State;
  searchFilters: fromSearchFiltersReducer.State;
  singledFilter: fromSingledFilterReducer.State;
  tooltipContainer: fromTooltipContainerReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  project_addData: AddDataState;
}

// Feature area reducers
export const reducers = {
  addSurveyDataPage: fromAddSurveyDataPageReducer.reducer,
  searchResults: fromSearchResultsReducer.reducer,
  searchFilters: fromSearchFiltersReducer.reducer,
  singledFilter: fromSingledFilterReducer.reducer,
  tooltipContainer: fromTooltipContainerReducer.reducer
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

export const selectSearchFiltersState = createSelector(
  selectFeatureAreaState,
  (state: AddDataState) => state.searchFilters
);

export const selectSingledFilterState = createSelector(
  selectFeatureAreaState,
  (state: AddDataState) => state.singledFilter
);


export const selectTooltipContainerState = createSelector(
  selectFeatureAreaState,
  (state: AddDataState) => state.tooltipContainer
);

// Add Survey Data Page Selectors
export const getJobContext = createSelector(
  selectAddSurveyDataPageState,
  fromAddSurveyDataPageReducer.getJobContext
);

export const getPageShown = createSelector(
  selectAddSurveyDataPageState,
  fromAddSurveyDataPageReducer.getPageShown
);

export const getAddingData = createSelector(
  selectAddSurveyDataPageState,
  fromAddSurveyDataPageReducer.getAddingData
);

export const getSearchingFilter = createSelector(
  selectAddSurveyDataPageState,
  fromAddSurveyDataPageReducer.getSearchingFilter
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

export const getResultsPagingOptions = createSelector(
  selectSearchResultsState,
  fromSearchResultsReducer.getPagingOptions
);

export const getResultsTotal = createSelector(
  selectSearchResultsState,
  fromSearchResultsReducer.getNumberOfResults
);

export const getHasMoreResultsOnServer = createSelector(
  selectSearchResultsState,
  fromSearchResultsReducer.hasMoreResultsOnServer
);

export const getSelectedDataCuts = createSelector(
  selectSearchResultsState,
  fromSearchResultsReducer.getSelectedDataCuts
);
export const getSearchResultsError = createSelector(
  selectSearchResultsState,
  fromSearchResultsReducer.getError
);

// Search Filters Selectors
export const getFilters = createSelector(
  selectSearchFiltersState,
  fromSearchFiltersReducer.getFilters
);

export const getLoadingDefaultSurveyScopes = createSelector(
  selectSearchFiltersState,
  fromSearchFiltersReducer.getLoadingDefaultSurveyScopes
);

export const getSavedFilters = createSelector(
  selectSearchFiltersState,
  fromSearchFiltersReducer.getSavedFilters
);

// Tooltip Container Selectors
export const getJobDetailsTooltipOpen = createSelector(
  selectTooltipContainerState,
  fromTooltipContainerReducer.getJobDetailsTooltipOpen
);

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

// Singled Filter
export const getSingledFilter = createSelector(
  selectSingledFilterState,
  fromSingledFilterReducer.getFilter
);

export const getLoadingOptions = createSelector(
  selectSingledFilterState,
  fromSingledFilterReducer.getLoadingOptions
);

export const getLoadingOptionsError = createSelector(
  selectSingledFilterState,
  fromSingledFilterReducer.getLoadingOptionsError
);

export const getSingledFilterSelectionCount = createSelector(
  getSingledFilter,
  getFilters,
  (singledFilter, filters) => {
    const backingFilter = <MultiSelectFilter>filters.find(f => f.Id === singledFilter.Id);
    return backingFilter.Options.filter(o => o.Selected).length;
  }
);
