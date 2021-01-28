import cloneDeep from 'lodash/cloneDeep';

import { Filter } from '../models';
import * as fromChildFilterActions from '../actions/child-filter.actions';

export interface State {
  filter: Filter;
  searchValue: string;
  parentOptionValue: string;
  parentOptionName: string;
}

const initialState = {
  filter: null,
  searchValue: '',
  parentOptionValue : '',
  parentOptionName: ''
};

export function reducer(state = initialState, action: fromChildFilterActions.Actions): State {
  switch (action.type) {

    case fromChildFilterActions.CLEAR_SELECTIONS: {
      const filterCopy = cloneDeep(state.filter);

      if (filterCopy) {
        filterCopy.Options.map(o => o.Selected = false);
      }

      return {
        ...state,
        filter: filterCopy
      };
    }
    case fromChildFilterActions.SET_CHILD_FILTER_OPTIONS: {
      const filterCopy = cloneDeep(state.filter);
      const serverOptions = cloneDeep(action.payload.newOptions);
      const clientOptions = action.payload.replaceClientOptions ? [] : filterCopy.Options;
      const newOptions = serverOptions.filter(nO => clientOptions.findIndex(o => o.Value === nO.Value) < 0);
      const finalOptions = clientOptions.concat(newOptions);

      filterCopy.Options = finalOptions.map(o => {
        o.Selected = action.payload.currentSelections.some(so => so.Value === o.Value);
        return o;
      });

      return {
        ...state,
        filter: filterCopy
      };
    }
    case fromChildFilterActions.SET_SEARCH_VALUE: {
      return {
        ...state,
        searchValue: action.payload
      };
    }
    case fromChildFilterActions.SET_CHILD_FILTER: {

      return {
        ...state,
        filter: { ...<any>action.payload.filter, Options: [] },
        parentOptionValue: action.payload.parentOption.Value,
        parentOptionName: action.payload.parentOption.Name,
        searchValue: ''
      };
    }
    case fromChildFilterActions.TOGGLE_MULTI_SELECT_OPTION: {
      const filterCopy = cloneDeep(state.filter);
      const filterOption = filterCopy.Options
        .find(o => o.Value === action.payload.option.Value);

      filterOption.Selected = !filterOption.Selected;

      return {
        ...state,
        filter: filterCopy
      };
    }
    case fromChildFilterActions.CLEAR_CHILD_FILTER: {
      return {
        ...state,
        filter: null,
        parentOptionValue: ''
      };
    }
    case fromChildFilterActions.RESET: {
      return initialState;
    }
    case fromChildFilterActions.SET: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}

export const getFilter = (state: State) => state.filter;
export const getSearchValue = (state: State) => state.searchValue;
export const getParentOptionValue = (state: State) => state.parentOptionValue;
