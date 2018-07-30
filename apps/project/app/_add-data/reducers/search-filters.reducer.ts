import * as cloneDeep from 'lodash.clonedeep';

import * as fromSearchFiltersActions from '../actions/search-filters.actions';
import { staticFilters } from '../data';
import { Filter } from '../models';
import { mapSearchFilterToFilter } from '../helpers';

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
        .find(o => o.Id === action.payload.optionId);

      filterOption.Selected = !filterOption.Selected;

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

// Selector functions
export const getFilters = (state: State) => state.filters;
export const getLoadingDefaultSurveyScopes = (state: State) => state.loadingDefaultSurveyScopes;
