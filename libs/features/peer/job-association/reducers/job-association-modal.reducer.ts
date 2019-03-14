import * as jobAssociationModalActions from '../actions/job-association-modal.actions';

export interface State {
  savingAssociations: boolean;
  savingAssociationsError: boolean;
}

// Define initial state
const initialState: State = {
  savingAssociations: false,
  savingAssociationsError: false
};

export function reducer(state = initialState, action: jobAssociationModalActions.Actions): State {
  switch (action.type) {
    case jobAssociationModalActions.SAVE_JOB_ASSOCIATIONS: {
      return {
        ...state,
        savingAssociations: true
      };
    }
    case jobAssociationModalActions.SAVE_JOB_ASSOCIATIONS_SUCCESS: {
      return {
        ...state,
        savingAssociations: false,
        savingAssociationsError: false
      };
    }
    case jobAssociationModalActions.SAVE_JOB_ASSOCIATIONS_ERROR: {
      return {
        ...state,
        savingAssociations: false,
        savingAssociationsError: true
      };
    }
    case jobAssociationModalActions.RESET_JOB_ASSOCIATIONS_MODAL_STATE: {
      return {
        ...state,
        savingAssociations: false,
        savingAssociationsError: false
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getSaving = (state: State) => state.savingAssociations;
export const getSavingError = (state: State) => state.savingAssociationsError;
