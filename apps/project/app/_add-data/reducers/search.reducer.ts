import * as fromSearchActions from '../actions/search.actions';

import { ProjectSearchContext } from '../models';

export interface State {
  projectSearchContext: ProjectSearchContext;
  searchingFilter: boolean;
}

const initialState: State = {
  projectSearchContext: null,
  searchingFilter: false
};

// Reducer function
export function reducer(state = initialState, action: fromSearchActions.Actions): State {
  switch (action.type) {

    case fromSearchActions.SET_PROJECT_SEARCH_CONTEXT: {
      return {
        ...state,
        projectSearchContext: action.payload
      };
    }
    case fromSearchActions.TOGGLE_FILTER_SEARCH: {
      return {
        ...state,
        searchingFilter: !state.searchingFilter
      };
    }
    case fromSearchActions.HIDE_FILTER_SEARCH: {
      return {
        ...state,
        searchingFilter: false
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getProjectSearchContext = (state: State) => state.projectSearchContext;
export const getSearchingFilter = (state: State) => state.searchingFilter;
