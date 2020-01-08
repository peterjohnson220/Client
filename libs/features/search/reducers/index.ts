import { createFeatureSelector, createSelector } from '@ngrx/store';

import {Filter, FilterType, MultiSelectFilter, RangeFilter} from '../models';
// Import root app reducer
import * as fromRoot from 'libs/state/state';
// Import feature reducers
import * as fromSearchFiltersReducer from './search-filters.reducer';
import * as fromSingledFilterReducer from './singled-filter.reducer';
import * as fromSearchResultsReducer from './search-results.reducer';
import * as fromSearchPageReducer from './search-page.reducer';

// Feature area state
export interface SearchFeatureState {
  searchFilters: fromSearchFiltersReducer.State;
  singledFilter: fromSingledFilterReducer.State;
  searchResults: fromSearchResultsReducer.State;
  searchPage: fromSearchPageReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_search: SearchFeatureState;
}

// Feature area reducers
export const reducers = {
  searchFilters: fromSearchFiltersReducer.reducer,
  singledFilter: fromSingledFilterReducer.reducer,
  searchResults: fromSearchResultsReducer.reducer,
  searchPage: fromSearchPageReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<SearchFeatureState>('feature_search');

// Feature Selectors
export const selectSearchFiltersState = createSelector(
  selectFeatureAreaState,
  (state: SearchFeatureState) => state.searchFilters
);

export const selectSingledFilterState = createSelector(
  selectFeatureAreaState,
  (state: SearchFeatureState) => state.singledFilter
);

export const selectSearchResultsState = createSelector(
  selectFeatureAreaState,
  (state: SearchFeatureState) => state.searchResults
);

export const selectSearchPageState = createSelector(
  selectFeatureAreaState,
  (state: SearchFeatureState) => state.searchPage
);

// Search Filters Selectors
export const getFilters = createSelector(
  selectSearchFiltersState,
  fromSearchFiltersReducer.getFilters
);

export const getOverallFilterSelectionsCount = createSelector(
  getFilters,
  (filters: Filter[]) => {
    const multiSelectFilters = filters.filter(f => f.Type === FilterType.Multi);
    const RangeSelectFilter = filters.filter(f => f.Type === FilterType.Range);

    let returnCount = multiSelectFilters.reduce<number>((overallCount: number, currentFilter: MultiSelectFilter) => {
      const selections = currentFilter.Options.filter(o => o.Selected);
      const selectionCount = !!selections ? selections.length : 0;
      return overallCount += selectionCount;
    }, 0);

    returnCount += RangeSelectFilter.reduce<number>((overallCount: number, currentFilter: RangeFilter) => {
      const selectionCount = (currentFilter.SelectedMinValue !== null && currentFilter.SelectedMinValue !== currentFilter.MinimumValue) ||
                             (currentFilter.SelectedMaxValue !== null && currentFilter.SelectedMaxValue !== currentFilter.MaximumValue) ? 1 : 0;
      return overallCount += selectionCount;
    }, 0);
    return returnCount;
  }
);

// Singled Filter Selectors
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
    return !!backingFilter ? backingFilter.Options.filter(o => o.Selected).length : 0;
  }
);

// Search Results
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

export const getNumberOfResultsOnServer = createSelector(
  selectSearchResultsState,
  fromSearchResultsReducer.getNumberOfResultsOnServer
);

export const getSearchResultsError = createSelector(
  selectSearchResultsState,
  fromSearchResultsReducer.getError
);

// Search Page
export const getSearchingFilter = createSelector(
  selectSearchPageState,
  fromSearchPageReducer.getSearchingFilter
);

export const getPageShown = createSelector(
  selectSearchPageState,
  fromSearchPageReducer.getPageShown
);
