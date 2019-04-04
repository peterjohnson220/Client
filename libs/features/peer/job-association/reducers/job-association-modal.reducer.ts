import * as jobAssociationModalActions from '../actions/job-association-modal.actions';

export interface State {
  isModalOpen: boolean;
  savingAssociations: boolean;
  savingAssociationsError: boolean;
}

// Define initial state
const initialState: State = {
  isModalOpen: false,
  savingAssociations: false,
  savingAssociationsError: false
};

export function reducer(state = initialState, action: jobAssociationModalActions.Actions): State {
  switch (action.type) {
    case jobAssociationModalActions.CLOSE_JOB_ASSOCIATIONS_MODAL: {
      return {
        ...state,
        isModalOpen: false
      };
    }
    case jobAssociationModalActions.OPEN_JOB_ASSOCIATIONS_MODAL: {
      return {
        ...state,
        isModalOpen: true
      };
    }
    case jobAssociationModalActions.RELOAD_JOB_ASSOCIATIONS_MODAL:
    case jobAssociationModalActions.RESET_JOB_ASSOCIATIONS_MODAL: {
      return {
        ...state,
        savingAssociations: false,
        savingAssociationsError: false
      };
    }
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
    default: {
      return state;
    }
  }
}

// Selector functions
export const getIsModalOpen = (state: State) => state.isModalOpen;
export const getSaving = (state: State) => state.savingAssociations;
export const getSavingError = (state: State) => state.savingAssociationsError;
