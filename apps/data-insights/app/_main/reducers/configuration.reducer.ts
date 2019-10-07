import * as cloneDeep from 'lodash.clonedeep';

import * as fromConfigurationActions from '../actions/configuration.actions';
import { Filter } from '../models';

export interface State {
  activeFilters: Filter[];
  pendingFilters: Filter[];
}

const initialState: State = {
  activeFilters: [],
  pendingFilters: []
};

export function reducer(state = initialState, action: fromConfigurationActions.Actions): State {
  switch (action.type) {
    case fromConfigurationActions.ADD_FILTER: {
      return {
        ...state,
        pendingFilters: [...state.pendingFilters, action.payload]
      };
    }
    case fromConfigurationActions.SET_FILTERS: {
      return {
        ...state,
        activeFilters: action.payload,
        pendingFilters: action.payload
      };
    }
    case fromConfigurationActions.UPDATE_FILTER: {
      const filtersClone: Filter[] = cloneDeep(state.pendingFilters);
      const filterToUpdate = filtersClone.find((f, index) => index === action.payload.index);
      if (filterToUpdate) {
        filterToUpdate.Field = action.payload.filter.Field;
        filterToUpdate.Operator = action.payload.filter.Operator;
        filterToUpdate.Options = action.payload.filter.Options;
        filterToUpdate.SelectedOptions = action.payload.filter.SelectedOptions;
        filterToUpdate.IsValid = action.payload.filter.IsValid;
      }

      return {
        ...state,
        pendingFilters: filtersClone
      };
    }
    case fromConfigurationActions.REMOVE_PENDING_FILTER_BY_INDEX: {
      let pendingFiltersClone: Filter[] = cloneDeep(state.pendingFilters);
      pendingFiltersClone = pendingFiltersClone.filter((f, index) => index !== action.payload.index);
      return {
        ...state,
        pendingFilters: pendingFiltersClone
      };
    }
    case fromConfigurationActions.REMOVE_ACTIVE_FILTER_BY_INDEX: {
      let activeFiltersClone: Filter[] = cloneDeep(state.activeFilters);
      activeFiltersClone = activeFiltersClone.filter((f, index) => index !== action.payload.index);
      return {
        ...state,
        activeFilters: activeFiltersClone
      };
    }
    case fromConfigurationActions.REMOVE_PENDING_FILTERS_BY_FIELD: {
      const pendingFiltersClone: Filter[] = state.pendingFilters.filter(f => f.Field.DataElementId !== action.payload.DataElementId);
      return {
        ...state,
        pendingFilters: pendingFiltersClone
      };
    }
    case fromConfigurationActions.REMOVE_ACTIVE_FILTERS_BY_FIELD: {
      const activeFiltersClone: Filter[] = state.activeFilters.filter(f => f.Field.DataElementId !== action.payload.DataElementId);
      return {
        ...state,
        activeFilters: activeFiltersClone
      };
    }
    case fromConfigurationActions.GET_FILTER_OPTIONS_SUCCESS: {
      const filtersClone: Filter[] = cloneDeep(state.pendingFilters);
      const filterToUpdate = filtersClone.find((f, index) => index === action.payload.index);
      if (filterToUpdate) {
        filterToUpdate.Options = action.payload.options;
      }

      return {
        ...state,
        pendingFilters: filtersClone
      };
    }
    case fromConfigurationActions.RESET_FILTERS: {
      return {
        ...state,
        activeFilters: [],
        pendingFilters: []
      };
    }
    case fromConfigurationActions.APPLY_FILTERS: {
      return {
        ...state,
        activeFilters: state.pendingFilters
      };
    }
    default: {
      return state;
    }
  }
}

export const getActiveFilters = (state: State) => state.activeFilters;
export const getActiveFiltersCount = (state: State) => !!state.activeFilters ? state.activeFilters.length : 0;
export const getPendingFilters = (state: State) => state.pendingFilters;
export const getPendingFiltersValid = (state: State) => !!state.pendingFilters.length && !state.pendingFilters.some(x => x.IsValid === false);
