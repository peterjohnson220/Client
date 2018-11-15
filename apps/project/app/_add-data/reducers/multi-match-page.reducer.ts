import * as fromMultiMatchPageActions from '../actions/multi-match-page.actions';
import {ProjectContext} from '../models';

export interface State {
  pageShown: boolean;
  projectContext: ProjectContext;
  savingChanges: boolean;
  saveChangesError: boolean;
}

const initialState: State = {
  pageShown: false,
  projectContext: null,
  savingChanges: false,
  saveChangesError: false
};

// Reducer function
export function reducer(state = initialState, action: fromMultiMatchPageActions.Actions): State {
  switch (action.type) {
    case fromMultiMatchPageActions.HIDE_PAGE: {
      return {
        ...state,
        pageShown: false
      };
    }
    case fromMultiMatchPageActions.SET_PROJECT_CONTEXT: {
      return {
        ...state,
        projectContext: action.payload,
        pageShown: true
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
export const getPageShown = (state: State) => state.pageShown;
export const getProjectContext = (state: State) => state.projectContext;
export const getSavingChanges = (state: State) => state.savingChanges;
export const getSavingChangesError = (state: State) => state.saveChangesError;
