import { createFeatureSelector, createSelector } from '@ngrx/store';

import {Filter, FilterType, MultiSelectFilter, RangeFilter} from '../models';
// Import root app reducer
import * as fromRoot from 'libs/state/state';
// Import feature reducers
import * as fromSearchFiltersReducer from './search-filters.reducer';
import * as fromSingledFilterReducer from './singled-filter.reducer';
import * as fromSearchResultsReducer from './search-results.reducer';
import * as fromSearchPageReducer from './search-page.reducer';
import * as fromChildFilterReducer from './child-filter.reducer';
import {getParentOptionValue} from './child-filter.reducer';

// Feature area state
export interface SearchFeatureState {
  searchFilters: fromSearchFiltersReducer.State;
  singledFilter: fromSingledFilterReducer.State;
  childFilter: fromChildFilterReducer.State;
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
  childFilter: fromChildFilterReducer.reducer,
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

export const selectChildFilterState = createSelector(
  selectFeatureAreaState,
  (state: SearchFeatureState) => state.childFilter
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
export const getParentFilters = createSelector(
  selectSearchFiltersState,
  fromSearchFiltersReducer.getParentFilters
);

export const getAllFilters = createSelector(
  selectSearchFiltersState,
  fromSearchFiltersReducer.getAllFilters
);

export const getChildFilters = createSelector(
  selectSearchFiltersState,
  fromSearchFiltersReducer.getChildFilters
);

export const getChildFilterName = createSelector(
  selectChildFilterState,
  (childFilter) => {
    return childFilter.parentOptionName;
  }
);

export const getOverallFilterSelectionsCount = createSelector(
  getAllFilters,
  (filters: Filter[]) => {
    const multiSelectFilters = filters.filter(f => f.Type === FilterType.Multi || f.Type === FilterType.FilterableMulti);
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

export const getChildFilter = createSelector(
  selectChildFilterState,
  fromChildFilterReducer.getFilter
);

export const getChildFilterParentOptionValue = createSelector(
  selectChildFilterState,
  fromChildFilterReducer.getParentOptionValue
);

export const getSingledFilterSearchValue = createSelector(
  selectSingledFilterState,
  fromSingledFilterReducer.getSearchValue
);

export const getChildFilterSearchValue = createSelector(
  selectChildFilterState,
  fromChildFilterReducer.getSearchValue
);

export const getSingledFilterSelectionCount = createSelector(
  getSingledFilter,
  getParentFilters,
  (singledFilter, filters) => {
    const backingFilter = <MultiSelectFilter>filters.find(f => f.Id === singledFilter.Id);
    return !!backingFilter ? backingFilter.Options.filter(o => o.Selected).length : 0;
  }
);

export const getChildFilterSelectionCount = createSelector(
  getChildFilter,
  getChildFilters,
  getParentOptionValue,
  (childFilter, filters, parentOptionValue) => {
    const backingFilter = <MultiSelectFilter>filters.find(f => childFilter && f.Id === childFilter.Id);

    return !!backingFilter ? backingFilter.Options.filter(o => o.Selected && JSON.parse(o.Value).ParentOptionValue === parentOptionValue).length : 0;
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
export const getSearchFeatureId = createSelector(
  selectSearchPageState,
  fromSearchPageReducer.getSearchFeatureId
);

export const getSearchFilterMappingData = createSelector(
  selectSearchPageState,
  fromSearchPageReducer.getSearchFilterMappingData
);

export const getUserFilterTypeData = createSelector(
  selectSearchPageState,
  fromSearchPageReducer.getUserFilterTypeData
);

export const getSearchingFilter = createSelector(
  selectSearchPageState,
  fromSearchPageReducer.getSearchingFilter
);

export const getSearchingChildFilter = createSelector(
  selectSearchPageState,
  fromSearchPageReducer.getSearchingChildFilter
);

export const getPageShown = createSelector(
  selectSearchPageState,
  fromSearchPageReducer.getPageShown
);
