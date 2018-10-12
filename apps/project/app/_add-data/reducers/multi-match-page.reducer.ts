import * as fromMultiMatchPageActions from '../actions/multi-match-page.actions';
import {ProjectContext} from '../models';

export interface State {
  pageShown: boolean;
  projectContext: ProjectContext;
}

const initialState: State = {
  pageShown: false,
  projectContext: null
};

// Reducer function
export function reducer(state = initialState, action: fromMultiMatchPageActions.Actions): State {
  switch (action.type) {

    case fromMultiMatchPageActions.CLOSE_MULTI_MATCH: {
      return {
        ...state,
        pageShown: false
      };
    }
    case fromMultiMatchPageActions.SET_PROJECT_CONTEXT: {
      return {
        ...state,
        projectContext: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getPageShown = (state: State) => state.pageShown;
export const getProjectContext = (state: State) => state.projectContext;
