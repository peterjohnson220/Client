import * as cloneDeep from 'lodash.clonedeep';
import * as isEqual from 'lodash.isequal';

import * as fromSingledFilterActions from '../actions/singled-filter.actions';
import { Filter } from '../models';

export interface State {
  loadingOptions: boolean;
  loadingOptionsError: boolean;
  filter: Filter;
  searchValue: string;
}

const initialState: State = {
  loadingOptions: false,
  loadingOptionsError: false,
  filter: null,
  searchValue: ''
};

// Reducer function
export function reducer(state = initialState, action: fromSingledFilterActions.Actions): State {
  switch (action.type) {
    case fromSingledFilterActions.APPLY_SELECTIONS: {
      const filterCopy = cloneDeep(state.filter);

      if (action.payload.length) {
        filterCopy.Options.map(fo => {
          fo.Selected = action.payload.some(po => isEqual(fo.Value, po.Value));
        });
      } else {
        filterCopy.Options.map(fo => fo.Selected = false);
      }

      return {
        ...state,
        filter: filterCopy
      };
    }
    case fromSingledFilterActions.CLEAR_SELECTIONS: {
      const filterCopy = cloneDeep(state.filter);

      if (filterCopy) {
        filterCopy.Options.map(o => o.Selected = false);
      }

      return {
        ...state,
        filter: filterCopy
      };
    }
    case fromSingledFilterActions.SEARCH_AGGREGATION: {
      return {
        ...state,
        loadingOptions: true,
        loadingOptionsError: false
      };
    }
    case fromSingledFilterActions.SEARCH_AGGREGATION_ERROR: {
      return {
        ...state,
        loadingOptions: false,
        loadingOptionsError: true
      };
    }
    case fromSingledFilterActions.SEARCH_AGGREGATION_SUCCESS: {
      const filterCopy = cloneDeep(state.filter);
      filterCopy.Options = cloneDeep(action.payload.newOptions);
      let subFilter;

      if (action.payload.subFilters) {
       subFilter = cloneDeep(action.payload.subFilters).filter(x => x.ParentBackingField === filterCopy.BackingField)[0];
        if (subFilter) {
          filterCopy.Options.forEach(o => {
            o.SelectionsCount = subFilter.Options.filter( op => JSON.parse(op.Value).ParentOptionValue === o.Value && op.Selected).length;
          });
        }
      }

      filterCopy.Options = filterCopy.Options.map(o => {
        o.Selected = action.payload.currentSelections.some(so => so.Value === o.Value);
        return o;
      });

      return {
        ...state,
        loadingOptions: false,
        filter: filterCopy
      };
    }
    case fromSingledFilterActions.SET_SEARCH_VALUE: {
      return {
        ...state,
        searchValue: action.payload
      };
    }
    case fromSingledFilterActions.SET_SINGLED_FILTER: {
      return {
        ...state,
        filter: action.payload,
        searchValue: ''
      };
    }
    case fromSingledFilterActions.REMOVE_FILTER_VALUE: {
      const filterCopy = cloneDeep(state.filter);
      let optionToRemove;

      if (filterCopy) {
        optionToRemove = filterCopy.Options.find(o => isEqual(o.Value, action.payload.value));
      }

      if (optionToRemove) {
        optionToRemove.Selected = false;
      }

      return {
        ...state,
        filter: filterCopy
      };
    }
    case fromSingledFilterActions.TOGGLE_MULTI_SELECT_OPTION: {
      const filterCopy = cloneDeep(state.filter);
      const filterOption = filterCopy.Options
        .find(o => o.Value === action.payload.option.Value);

      filterOption.Selected = !filterOption.Selected;

      return {
        ...state,
        filter: filterCopy
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getFilter = (state: State) => state.filter;
export const getLoadingOptions = (state: State) => state.loadingOptions;
export const getLoadingOptionsError = (state: State) => state.loadingOptionsError;
export const getSearchValue = (state: State) => state.searchValue;
