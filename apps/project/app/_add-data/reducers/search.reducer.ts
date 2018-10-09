import * as fromSearchActions from '../actions/search.actions';

import { ProjectSearchContext } from '../models';

export interface State {
  projectSearchContext: ProjectSearchContext;
}

const initialState: State = {
  projectSearchContext: null
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
    default: {
      return state;
    }
  }
}

// Selector functions
export const getProjectSearchContext = (state: State) => state.projectSearchContext;
