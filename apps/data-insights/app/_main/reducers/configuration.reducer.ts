import * as cloneDeep from 'lodash.clonedeep';

import * as fromConfigurationActions from '../actions/configuration.actions';
import { Filter } from '../models';

export interface State {
  filters: Filter[];
}

const initialState: State = {
  filters: []
};

export function reducer(state = initialState, action: fromConfigurationActions.Actions): State {
  switch (action.type) {
    case fromConfigurationActions.ADD_FILTER: {
      return {
        ...state,
        filters: [...state.filters, action.payload]
      };
    }
    case fromConfigurationActions.SET_FILTERS: {
      return {
        ...state,
        filters: action.payload
      };
    }
    case fromConfigurationActions.UPDATE_FILTER_SELECTED_FIELD: {
      const filtersClone: Filter[] = cloneDeep(state.filters);
      const filterToUpdate = filtersClone.find((f, index) => index === action.payload.index);
      if (filterToUpdate) {
        filterToUpdate.Field = action.payload.field;
        filterToUpdate.Options = [];
      }

      return {
        ...state,
        filters: filtersClone
      };
    }
    case fromConfigurationActions.UPDATE_FILTER_SELECTED_OPTIONS: {
      const filtersClone: Filter[] = cloneDeep(state.filters);
      const filterToUpdate = filtersClone.find((f, index) => index === action.payload.index);
      if (filterToUpdate) {
        filterToUpdate.SelectedOptions = action.payload.selectedOptions;
      }

      return {
        ...state,
        filters: filtersClone
      };
    }
    case fromConfigurationActions.REMOVE_FILTER: {
      return {
        ...state,
        filters: state.filters.filter(f => f.Field.DataElementId !== action.payload.DataElementId)
      };
    }
    case fromConfigurationActions.GET_FILTER_OPTIONS_SUCCESS: {
      const filtersClone: Filter[] = cloneDeep(state.filters);
      const filterToUpdate = filtersClone.find((f, index) => index === action.payload.index);
      if (filterToUpdate) {
        filterToUpdate.Options = action.payload.options;
      }

      return {
        ...state,
        filters: filtersClone
      };
    }
    case fromConfigurationActions.RESET_FILTERS: {
      return {
        ...state,
        filters: []
      };
    }
    default: {
      return state;
    }
  }
}

export const getFilters = (state: State) => state.filters;
export const getFiltersValid = (state: State) => state.filters.length && !state.filters.some(x => x.SelectedOptions.length === 0);