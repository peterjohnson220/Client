import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

import * as fromSingledFilterActions from '../actions/singled-filter.actions';
import { Filter } from '../models';

export interface State {
  filter: Filter;
  searchValue: string;
}

const initialState: State = {
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
    case fromSingledFilterActions.SET_SINGLED_FILTER_OPTIONS: {
      const filterCopy = cloneDeep(state.filter);
      const serverOptions = cloneDeep(action.payload.newOptions);
      const clientOptions = action.payload.replaceClientOptions ? [] : filterCopy.Options;
      const newOptions = serverOptions.filter(nO => clientOptions.findIndex(o => o.Value === nO.Value) < 0);
      const finalOptions = clientOptions.concat(newOptions);

      let subFilter;

      if (action.payload.subFilters) {
       subFilter = cloneDeep(action.payload.subFilters).filter(x => x.ParentBackingField === filterCopy.BackingField)[0];
        if (subFilter) {
          finalOptions.forEach(o => {
            o.SelectionsCount = subFilter.Options.filter( op => JSON.parse(op.Value).ParentOptionValue === o.Value && op.Selected).length;
          });
        }
      }

      filterCopy.Options = finalOptions.map(o => {
        o.Selected = action.payload.currentSelections.some(so => so.Value === o.Value);
        return o;
      });

      return {
        ...state,
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
    case fromSingledFilterActions.RESET: {
      return initialState;
    }
    case fromSingledFilterActions.SET: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getFilter = (state: State) => state.filter;
export const getSearchValue = (state: State) => state.searchValue;
