import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromAddSurveyDataPageReducer from './add-survey-data-page.reducer';
import * as fromMultiMatchPageReducer from './multi-match-page.reducer';
import * as fromSearchResultsReducer from './search-results.reducer';
import * as fromSearchFiltersReducer from './search-filters.reducer';
import * as fromSingledFilterReducer from './singled-filter.reducer';
import * as fromTooltipContainerReducer from './tooltip-container.reducer';
import * as fromSearchReducer from './search.reducer';
import * as fromJobsToPriceReducer from './jobs-to-price.reducer';
import * as fromResultsHeaderReducer from './results-header.reducer';
import { MultiSelectFilter } from '../models';

// Feature area state
export interface AddDataState {
  addSurveyDataPage: fromAddSurveyDataPageReducer.State;
  multiMatchPage: fromMultiMatchPageReducer.State;
  search: fromSearchReducer.State;
  searchResults: fromSearchResultsReducer.State;
  resultsHeader: fromResultsHeaderReducer.State;
  searchFilters: fromSearchFiltersReducer.State;
  singledFilter: fromSingledFilterReducer.State;
  tooltipContainer: fromTooltipContainerReducer.State;
  jobsToPrice: fromJobsToPriceReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  project_addData: AddDataState;
}

// Feature area reducers
export const reducers = {
  addSurveyDataPage: fromAddSurveyDataPageReducer.reducer,
  multiMatchPage: fromMultiMatchPageReducer.reducer,
  searchResults: fromSearchResultsReducer.reducer,
  resultsHeader: fromResultsHeaderReducer.reducer,
  searchFilters: fromSearchFiltersReducer.reducer,
  singledFilter: fromSingledFilterReducer.reducer,
  tooltipContainer: fromTooltipContainerReducer.reducer,
  search: fromSearchReducer.reducer,
  jobsToPrice: fromJobsToPriceReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<AddDataState>('project_addData');

// Feature Selectors
export const selectAddSurveyDataPageState = createSelector(
  selectFeatureAreaState,
  (state: AddDataState) => state.addSurveyDataPage
);

export const selectMultiMatchPageState = createSelector(
  selectFeatureAreaState,
  (state: AddDataState) => state.multiMatchPage
);

export const selectSearchResultsState = createSelector(
  selectFeatureAreaState,
  (state: AddDataState) => state.searchResults
);

export const selectResultsHeaderState = createSelector(
  selectFeatureAreaState,
  (state: AddDataState) => state.resultsHeader
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

export const selectSearchState = createSelector(
  selectFeatureAreaState,
  (state: AddDataState) => state.search
);

export const selectJobsToPriceState = createSelector(
  selectFeatureAreaState,
  (state: AddDataState) => state.jobsToPrice
);

// Multi Match Page Selectors

export const getMultiMatchPageShown = createSelector(
  selectMultiMatchPageState,
  fromMultiMatchPageReducer.getPageShown
);

export const getMultimatchProjectContext = createSelector(
  selectMultiMatchPageState,
  fromMultiMatchPageReducer.getProjectContext
);

export const getSavingJobMatchUpdates = createSelector(
  selectMultiMatchPageState,
  fromMultiMatchPageReducer.getSavingChanges
);

export const getSavingJobMatchError = createSelector(
  selectMultiMatchPageState,
  fromMultiMatchPageReducer.getSavingChangesError
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

// Search Selectors
export const getProjectSearchContext = createSelector(
  selectSearchState,
  fromSearchReducer.getProjectSearchContext
);

export const getSearchingFilter = createSelector(
  selectSearchState,
  fromSearchReducer.getSearchingFilter
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

// Results Header Selectors
export const getLoadingSavedFilters = createSelector(
  selectResultsHeaderState,
  fromResultsHeaderReducer.getLoadingSavedFilters
);

export const getSavedFilters = createSelector(
  selectResultsHeaderState,
  fromResultsHeaderReducer.getSavedFilters
);

export const getSavingFilter = createSelector(
  selectResultsHeaderState,
  fromResultsHeaderReducer.getSavingFilter
);

export const getDeletingSavedFilter = createSelector(
  selectResultsHeaderState,
  fromResultsHeaderReducer.getDeletingSavedFilter
);

export const getFilterIdToDelete = createSelector(
  selectResultsHeaderState,
  fromResultsHeaderReducer.getFilterIdToDelete
);

export const getSavingFilterConflict = createSelector(
  selectResultsHeaderState,
  fromResultsHeaderReducer.getSavingFilterConflict
);

export const getSavingFilterError = createSelector(
  selectResultsHeaderState,
  fromResultsHeaderReducer.getSavingFilterError
);

export const getSaveFilterModalOpen = createSelector(
  selectResultsHeaderState,
  fromResultsHeaderReducer.getSaveFilterModalOpen
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

export const getSingledFilterSearchValue = createSelector(
  selectSingledFilterState,
  fromSingledFilterReducer.getSearchValue
);

export const getSingledFilterSelectionCount = createSelector(
  getSingledFilter,
  getFilters,
  (singledFilter, filters) => {
    const backingFilter = <MultiSelectFilter>filters.find(f => f.Id === singledFilter.Id);
    return backingFilter.Options.filter(o => o.Selected).length;
  }

);

export const getLoadingJobsToPrice = createSelector(
  selectJobsToPriceState,
  fromJobsToPriceReducer.getLoadingJobs
);

export const getJobsToPrice = createSelector(
  selectJobsToPriceState,
  fromJobsToPriceReducer.getJobsToPrice
);

export const getLoadingJobsToPriceError = createSelector(
  selectJobsToPriceState,
  fromJobsToPriceReducer.getLoadingJobsError
);
