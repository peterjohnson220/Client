import * as fromContextActions from '../actions/context.actions';

import { JobContext, ProjectSearchContext } from '../models';

export interface State {
  jobContext: JobContext;
  projectSearchContext: ProjectSearchContext;
}

const initialState: State = {
  jobContext: null,
  projectSearchContext: null
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
        projectSearchContext: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getJobContext = (state: State) => state.jobContext;
export const getProjectSearchContext = (state: State) => state.projectSearchContext;
