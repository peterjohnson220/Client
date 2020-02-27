import * as cloneDeep from 'lodash.clonedeep';
import {Filter} from '../models';
import * as fromChildFilterActions from '../actions/child-filter.actions';

export interface State {
  loadingOptions: boolean;
  loadingOptionsError: boolean;
  filter: Filter;
  searchValue: string;
  parentOptionValue: string;
  parentOptionName: string;
}

const initialState = {
  loadingOptions: false,
  loadingOptionsError: false,
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
    case fromChildFilterActions.SEARCH_AGGREGATION: {
      return {
        ...state,
        loadingOptions: true,
        loadingOptionsError: false
      };
    }
    case fromChildFilterActions.SEARCH_AGGREGATION_ERROR: {
      return {
        ...state,
        loadingOptions: false,
        loadingOptionsError: true
      };
    }
    case fromChildFilterActions.SEARCH_AGGREGATION_SUCCESS: {
      const filterCopy = cloneDeep(state.filter);
      filterCopy.Options = cloneDeep(action.payload.newOptions);

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
    default: {
      return state;
    }
  }
}

export const getFilter = (state: State) => state.filter;
export const getLoadingOptions = (state: State) => state.loadingOptions;
export const getLoadingOptionsError = (state: State) => state.loadingOptionsError;
export const getSearchValue = (state: State) => state.searchValue;
export const getParentOptionValue = (state: State) => state.parentOptionValue;
