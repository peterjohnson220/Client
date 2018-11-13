import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromSearchResultsReducer from './search-results.reducer';
import * as fromSearchFiltersReducer from './search-filters.reducer';
import * as fromSingledFilterReducer from './singled-filter.reducer';
import * as fromTooltipContainerReducer from './tooltip-container.reducer';
import * as fromSearchReducer from './search.reducer';
import * as fromSavedFiltersReducer from './saved-filters.reducer';
import { MultiSelectFilter } from '../models';

// Feature area state
export interface SharedProjectState {
  search: fromSearchReducer.State;
  searchResults: fromSearchResultsReducer.State;
  savedFilters: fromSavedFiltersReducer.State;
  searchFilters: fromSearchFiltersReducer.State;
  singledFilter: fromSingledFilterReducer.State;
  tooltipContainer: fromTooltipContainerReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  project_shared: SharedProjectState;
}

// Feature area reducers
export const reducers = {
  searchResults: fromSearchResultsReducer.reducer,
  savedFilters: fromSavedFiltersReducer.reducer,
  searchFilters: fromSearchFiltersReducer.reducer,
  singledFilter: fromSingledFilterReducer.reducer,
  tooltipContainer: fromTooltipContainerReducer.reducer,
  search: fromSearchReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<SharedProjectState>('project_shared');

// Feature Selectors
export const selectSearchResultsState = createSelector(
  selectFeatureAreaState,
  (state: SharedProjectState) => state.searchResults
);

export const selectSavedFiltersState = createSelector(
  selectFeatureAreaState,
  (state: SharedProjectState) => state.savedFilters
);

export const selectSearchFiltersState = createSelector(
  selectFeatureAreaState,
  (state: SharedProjectState) => state.searchFilters
);

export const selectSingledFilterState = createSelector(
  selectFeatureAreaState,
  (state: SharedProjectState) => state.singledFilter
);

export const selectTooltipContainerState = createSelector(
  selectFeatureAreaState,
  (state: SharedProjectState) => state.tooltipContainer
);

export const selectSearchState = createSelector(
  selectFeatureAreaState,
  (state: SharedProjectState) => state.search
);

// Search Selectors
export const getProjectSearchContext = createSelector(
  selectSearchState,
  fromSearchReducer.getProjectSearchContext
);

export const getJobContext = createSelector(
  selectSearchState,
  fromSearchReducer.getJobContext
);

export const getSearchingFilter = createSelector(
  selectSearchState,
  fromSearchReducer.getSearchingFilter
);

export const getPageShown = createSelector(
  selectSearchState,
  fromSearchReducer.getPageShown
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
  selectSavedFiltersState,
  fromSavedFiltersReducer.getLoadingSavedFilters
);

export const getSavedFilters = createSelector(
  selectSavedFiltersState,
  fromSavedFiltersReducer.getSavedFilters
);

export const getSavingFilter = createSelector(
  selectSavedFiltersState,
  fromSavedFiltersReducer.getSavingFilter
);

export const getDeletingSavedFilter = createSelector(
  selectSavedFiltersState,
  fromSavedFiltersReducer.getDeletingSavedFilter
);

export const getFilterIdToDelete = createSelector(
  selectSavedFiltersState,
  fromSavedFiltersReducer.getFilterIdToDelete
);

export const getSavingFilterConflict = createSelector(
  selectSavedFiltersState,
  fromSavedFiltersReducer.getSavingFilterConflict
);

export const getSavingFilterError = createSelector(
  selectSavedFiltersState,
  fromSavedFiltersReducer.getSavingFilterError
);

export const getSaveFilterModalOpen = createSelector(
  selectSavedFiltersState,
  fromSavedFiltersReducer.getSaveFilterModalOpen
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
    return !! backingFilter ? backingFilter.Options.filter(o => o.Selected).length : 0;
  }

);

