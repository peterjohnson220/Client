import * as cloneDeep from 'lodash.clonedeep';
import * as isEqual from 'lodash.isequal';

import * as fromSearchFiltersActions from '../actions/search-filters.actions';
import { staticFilters } from '../data';
import { Filter, isMultiFilter, isRangeFilter, isTextFilter } from '../models';
import {
  mapSearchFilterToFilter,
  mergeClientWithServerMultiSelectFilters,
  mergeClientWithServerRangeFilters
} from '../helpers';

const multiSelectToNotRefresh = f => isMultiFilter(f) && (!f.RefreshOptionsFromServer || f.Locked);
const filterToNotRefresh = f => isTextFilter(f) || multiSelectToNotRefresh(f);

export interface State {
  filters: Filter[];
  loadingDefaultSurveyScopes: boolean;
}

const initialState: State = {
  filters: staticFilters,
  loadingDefaultSurveyScopes: false
};

// Reducer function
export function reducer(state = initialState, action: fromSearchFiltersActions.Actions): State {
  switch (action.type) {
    case fromSearchFiltersActions.CLEAR_FILTERS: {
      return {
        ...state,
        filters: initialState.filters
      };
    }
    case fromSearchFiltersActions.UPDATE_FILTER_VALUE: {
      const filtersCopy = cloneDeep(state.filters);
      filtersCopy.find(f => f.Id === action.payload.filterId).Value = action.payload.value;

      return {
        ...state,
        filters: filtersCopy
      };
    }
    case fromSearchFiltersActions.GET_DEFAULT_SURVEY_SCOPES_FILTER: {
      return {
        ...state,
        loadingDefaultSurveyScopes: true
      };
    }
    case fromSearchFiltersActions.GET_DEFAULT_SURVEY_SCOPES_FILTER_SUCCESS: {
      let filters = state.filters;

      if (action.payload.Options.length) {
        filters = cloneDeep(state.filters);
        filters.push(mapSearchFilterToFilter(cloneDeep(action.payload)));
      }

      return {
        ...state,
        filters: filters,
        loadingDefaultSurveyScopes: false
      };
    }
    case fromSearchFiltersActions.TOGGLE_MULTI_SELECT_OPTION: {
      const filtersCopy = cloneDeep(state.filters);
      const filterOption = filtersCopy
        .find(f => f.Id === action.payload.filterId).Options
        .find(o => isEqual(o.Value, action.payload.option.Value));

      if (filterOption) {
        filterOption.Selected = !filterOption.Selected;
      } else {
        filtersCopy.find(f => f.Id === action.payload.filterId)
          .Options.push({...action.payload.option, Selected: true});
      }

      return {
        ...state,
        filters: filtersCopy
      };
    }
    case fromSearchFiltersActions.REFRESH_FILTERS: {
      const clientFilters = cloneDeep(state.filters);
      const clientFiltersNotBeingRefreshed = clientFilters.filter(filterToNotRefresh);
      const serverFilters = cloneDeep(action.payload.searchFilters);

      const newMultiSelectFilters = mergeClientWithServerMultiSelectFilters(
        {
          serverFilters: serverFilters.filter(f => isMultiFilter(f) && !clientFiltersNotBeingRefreshed.some(cf => cf.Id === f.Id)),
          clientFilters: clientFilters.filter(f => !filterToNotRefresh(f)),
          keepFilteredOutOptions: action.payload.keepFilteredOutOptions
        }
      );

      const newRangeFilters = mergeClientWithServerRangeFilters(
        {
          serverFilters: serverFilters.filter(f => isRangeFilter(f)),
          clientFilters: clientFilters.filter(f => isRangeFilter(f))
        }
      );

      const allFilters = clientFiltersNotBeingRefreshed.concat(newMultiSelectFilters).concat(newRangeFilters);

      allFilters.sort((a, b) => a.Order - b.Order);

      return {
        ...state,
        filters: allFilters
      };
    }
    case fromSearchFiltersActions.RESET_FILTER: {
      const copiedFilters = cloneDeep(state.filters);
      const filterToReset = copiedFilters.find(f => f.Id === action.payload);
      resetFilter(filterToReset);

      return {
        ...state,
        filters: copiedFilters
      };
    }
    case fromSearchFiltersActions.RESET_ALL_FILTERS: {
      return {
        ...state,
        filters: resetFilters(cloneDeep(state.filters))
      };
    }
    case fromSearchFiltersActions.UPDATE_RANGE_FILTER: {
      const filtersCopy = cloneDeep(state.filters);
      const rangeFilter = filtersCopy.find(f => f.Id === action.payload.filterId && isRangeFilter(f));
      rangeFilter.SelectedMinValue = action.payload.minValue;
      rangeFilter.SelectedMaxValue = action.payload.maxValue;

      return {
        ...state,
        filters: filtersCopy
      };
    }
    case fromSearchFiltersActions.ADD_FILTER: {
      const filtersCopy = cloneDeep(state.filters);
      filtersCopy.push(action.payload);

      return {
        ...state,
        filters: filtersCopy
      };
    }
    default: {
      return state;
    }
  }
}

// Helper functions
function resetFilters(filters: Filter[]): Filter[] {
  return filters.map(f => resetFilter(f) );
}

function resetFilter(filter: Filter) {
  if (isMultiFilter(filter) && !filter.Locked) {
    filter.Options.map(o => o.Selected = false);
  } else if (isRangeFilter(filter)) {
    filter.SelectedMaxValue = null;
    filter.SelectedMinValue = null;
    filter.MaximumValue = null;
    filter.MinimumValue = null;
  } else if (isTextFilter(filter)) {
    filter.Value = '';
  }
  return filter;
}

// Selector functions
export const getFilters = (state: State) => state.filters;
export const getLoadingDefaultSurveyScopes = (state: State) => state.loadingDefaultSurveyScopes;
