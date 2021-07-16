import * as fromMultiMatchPageActions from '../actions/multi-match-page.actions';
import { ProjectContext } from '../../../surveys/survey-search/models';

export interface State {
  projectContext: ProjectContext;
  savingChanges: boolean;
  saveChangesError: boolean;
  showModal: boolean;
}

const initialState: State = {
  projectContext: null,
  savingChanges: false,
  saveChangesError: false,
  showModal: false
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
        saveChangesError: true,
      };
    }
    case fromMultiMatchPageActions.SAVE_JOB_MATCH_UPDATES_SUCCESS: {
      return {
        ...state,
        savingChanges: false,
        saveChangesError: false,
      };
    }
    case fromMultiMatchPageActions.SET_MULTI_MATCH_MODAL_STATUS: {
      return {
        ...state,
        showModal: action.payload
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
export const getShowModal = (state: State) => state.showModal;
