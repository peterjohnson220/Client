import * as fromContextActions from '../actions/context.actions';

import { JobContext, SearchContext } from '../models';

export interface State {
  jobContext: JobContext;
  searchContext: SearchContext;
}

const initialState: State = {
  jobContext: null,
  searchContext: null
};

// Reducer function
export function reducer(state = initialState, action: fromContextActions.Actions): State {
  switch (action.type) {
    case fromContextActions.SET_JOB_CONTEXT: {
      return {
        ...state,
        jobContext: action.payload
      };
    }
    case fromContextActions.SET_PROJECT_SEARCH_CONTEXT: {
      return {
        ...state,
        searchContext: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getJobContext = (state: State) => state.jobContext;
export const getProjectSearchContext = (state: State) => state.searchContext;
