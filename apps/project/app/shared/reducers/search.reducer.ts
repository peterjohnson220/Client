import * as fromSearchActions from '../actions/search.actions';

import { JobContext, ProjectSearchContext } from '../models';

export interface State {
  pageShown: boolean;
  jobContext: JobContext;
  projectSearchContext: ProjectSearchContext;
  searchingFilter: boolean;
}

const initialState: State = {
  pageShown: false,
  jobContext: null,
  projectSearchContext: null,
  searchingFilter: false
};

// Reducer function
export function reducer(state = initialState, action: fromSearchActions.Actions): State {
  switch (action.type) {

    case fromSearchActions.CLOSE_SEARCH_PAGE: {
      return {
        ...state,
        pageShown: false,
      };
    }

    case fromSearchActions.HIDE_PAGE: {
      return {
        ...state,
        pageShown: false,
      };
    }

    case fromSearchActions.SET_JOB_CONTEXT: {
      return {
        ...state,
        jobContext: action.payload,
        pageShown: true
      };
    }

    case fromSearchActions.SET_PROJECT_SEARCH_CONTEXT: {
      return {
        ...state,
        projectSearchContext: action.payload,
        pageShown: true
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
export const getJobContext = (state: State) => state.jobContext;
export const getPageShown = (state: State) => state.pageShown;
export const getProjectSearchContext = (state: State) => state.projectSearchContext;
export const getSearchingFilter = (state: State) => state.searchingFilter;
