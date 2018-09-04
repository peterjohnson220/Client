import * as cloneDeep from 'lodash.clonedeep';

import * as fromSingledFilterActions from '../actions/singled-filter.actions';
import { Filter, MultiSelectFilter } from '../models';
import { mapSearchFilterOptionsToMultiSelectOptions } from '../helpers/model-mapping.helper';

export interface State {
  loadingOptions: boolean;
  filter: Filter;
}

const initialState: State = {
  loadingOptions: false,
  filter: null
};

// Reducer function
export function reducer(state = initialState, action: fromSingledFilterActions.Actions): State {
  switch (action.type) {
    case fromSingledFilterActions.SET_SINGLED_FILTER: {
      return {
        ...state,
        filter: action.payload
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
    case fromSingledFilterActions.SEARCH_AGGREGATION: {
      return {
        ...state,
        loadingOptions: true
      };
    }
    case fromSingledFilterActions.SEARCH_AGGREGATION_SUCCESS: {
      const filterCopy = cloneDeep(state.filter);
      filterCopy.Options = mapSearchFilterOptionsToMultiSelectOptions(action.payload);

      const singledFilter = <MultiSelectFilter>state.filter;
      const selectedOptions = singledFilter.Options.filter(o => o.Selected);

      filterCopy.Options = filterCopy.Options.map(o => {
        o.Selected = selectedOptions.some(so => so.Value === o.Value);
        return o;
      });

      return {
        ...state,
        loadingOptions: false,
        filter: filterCopy
      };
    }
    case fromSingledFilterActions.CLEAR_SELECTIONS: {
      const filterCopy = cloneDeep(state.filter);

      filterCopy.Options.map(o => o.Selected = false);

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

