import * as fromMultiMatchPageActions from '../actions/multi-match-page.actions';
import { ProjectContext } from '../../survey-search/models';

export interface State {
  projectContext: ProjectContext;
  savingChanges: boolean;
  saveChangesError: boolean;
}

const initialState: State = {
  projectContext: null,
  savingChanges: false,
  saveChangesError: false
};

// Reducer function
export function reducer(state = initialState, action: fromMultiMatchPageActions.Actions): State {
  switch (action.type) {

    case fromMultiMatchPageActions.SET_PROJECT_CONTEXT: {
      return {
        ...state,
        projectContext: action.payload
      };
    }
    case fromMultiMatchPageActions.SAVE_JOB_MATCH_UPDATES: {
      return {
        ...state,
        savingChanges: true
      };
    }
    case fromMultiMatchPageActions.SAVE_JOB_MATCH_UPDATES_ERROR: {
      return {
        ...state,
        savingChanges: false,
        saveChangesError: true
      };
    }
    case fromMultiMatchPageActions.SAVE_JOB_MATCH_UPDATES_SUCCESS: {
      return {
        ...state,
        savingChanges: false,
        saveChangesError: false
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getProjectContext = (state: State) => state.projectContext;
export const getSavingChanges = (state: State) => state.savingChanges;
export const getSavingChangesError = (state: State) => state.saveChangesError;
