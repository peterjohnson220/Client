// Import all exports from our feature's actions
import * as fromStructuresPageActions from '../actions/structures-page.actions';

// Define our feature state
export interface State {
  deleteStructuresModalOpen: boolean;
  deletingStructureError: boolean;
  deletingStructure: boolean;
}

// Define our initial state
const initialState: State = {
  deleteStructuresModalOpen: false,
  deletingStructureError: false,
  deletingStructure: false
};


// Reducer function
export function reducer(state = initialState, action: fromStructuresPageActions.Actions): State {
  switch (action.type) {
    case fromStructuresPageActions.CLOSE_DELETE_STRUCTURES_MODAL: {
      return {
        ...state,
        deleteStructuresModalOpen: false
      };
    }
    case fromStructuresPageActions.OPEN_DELETE_STRUCTURES_MODAL: {
      return {
        ...state,
        deleteStructuresModalOpen: true
      };
    }
    case fromStructuresPageActions.DELETE_STRUCTURE_MODEL: {
      return {
        ...state,
        deletingStructure: true,
        deletingStructureError: false
      };
    }
    case fromStructuresPageActions.DELETE_STRUCTURE_MODEL_ERROR: {
      return {
        ...state,
        deletingStructure: false,
        deletingStructureError: true
      };
    }
    case fromStructuresPageActions.DELETE_STRUCTURE_MODEL_SUCCESS: {
      return {
        ...state,
        deletingStructure: false,
        deletingStructureError: false
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getDeleteStructuresModalOpen = (state: State) => state.deleteStructuresModalOpen;
export const getDeletingStructureStatus = (state: State) => state.deletingStructure;
export const getDeletingStructureErrorStatus = (state: State) => state.deletingStructureError;
