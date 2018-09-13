import * as cloneDeep from 'lodash.clonedeep';
import * as isEqual from 'lodash.isequal';

import * as fromSearchFiltersActions from '../actions/search-filters.actions';
import { staticFilters } from '../data';
import { Filter, isMultiFilter, isTextFilter } from '../models';
import { mapSearchFilterToFilter, mergeClientWithServerFilters } from '../helpers';

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
      const filtersNotBeingRefreshed = state.filters.filter(f => !isMultiFilter(f) || !f.RefreshOptionsFromServer);
      const filtersToRefresh = cloneDeep(state.filters.filter(f => isMultiFilter(f) && f.RefreshOptionsFromServer));
      const serverFilters = cloneDeep(action.payload.searchFilters);

      const newFilters = mergeClientWithServerFilters(
        {
          serverFilters: serverFilters,
          clientFilters: filtersToRefresh,
          keepFilteredOutOptions: action.payload.keepFilteredOutOptions
        }
      );

      const allFilters = filtersNotBeingRefreshed.concat(newFilters);

      allFilters.sort((a, b) => a.Order - b.Order);

      return {
        ...state,
        filters: allFilters
      };
    }
    case fromSearchFiltersActions.RESET_FILTER: {
      const copiedFilters = cloneDeep(state.filters);
      const filterToReset = copiedFilters.find(f => f.Id === action.payload);

      if (isMultiFilter(filterToReset)) {
        filterToReset.Options.map(o => o.Selected = false);
      } else if (isTextFilter(filterToReset)) {
        filterToReset.Value = '';
      }

      return {
        ...state,
        filters: copiedFilters
      };
    }
    case fromSearchFiltersActions.RESET_ALL_FILTERS: {
      let copiedFilters = cloneDeep(state.filters);

      copiedFilters = copiedFilters.map(f => {
        if (isMultiFilter(f)) {
          f.Options.map(o => o.Selected = false);
        } else if (isTextFilter(f)) {
          f.Value = '';
        }

        return f;
      });

      return {
        ...state,
        filters: copiedFilters
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getFilters = (state: State) => state.filters;
export const getLoadingDefaultSurveyScopes = (state: State) => state.loadingDefaultSurveyScopes;
