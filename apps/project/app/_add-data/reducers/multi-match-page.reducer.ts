import * as fromMultiMatchPageActions from '../actions/multi-match-page.actions';
import {ProjectContext} from '../models';

export interface State {
  pageShown: boolean;
  searchingFilter: boolean;
  projectContext: ProjectContext;
}

const initialState: State = {
  pageShown: false,
  searchingFilter: false,
  projectContext: null
};

// Reducer function
export function reducer(state = initialState, action: fromMultiMatchPageActions.Actions): State {
  switch (action.type) {

    case fromMultiMatchPageActions.CLOSE_MULTI_MATCH: {
      return {
        ...state,
        pageShown: false,
        searchingFilter: false
      };
    }
    case fromMultiMatchPageActions.SET_PROJECT_CONTEXT: {
      return {
        ...state,
        projectContext: action.payload
      };
    }
    case fromMultiMatchPageActions.TOGGLE_FILTER_SEARCH: {
      return {
        ...state,
        searchingFilter: !state.searchingFilter
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getPageShown = (state: State) => state.pageShown;
export const getSearchingFilter = (state: State) => state.searchingFilter;
export const getProjectContext = (state: State) => state.projectContext;
