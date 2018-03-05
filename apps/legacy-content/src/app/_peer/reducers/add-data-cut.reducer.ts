import * as fromAddDataCutActions from '../actions/add-data-cut.actions';

export interface State {
  addingDataCut: boolean;
  addingDataCutError: boolean;
}

// Initial State
export const initialState: State = {
  addingDataCut: false,
  addingDataCutError: false
};

// Reducer
export function reducer(
  state = initialState,
  action: fromAddDataCutActions.Actions
): State {
  switch (action.type) {
    case fromAddDataCutActions.ADDING_DATA_CUT: {
      return {
        ...state,
        addingDataCut: true,
        addingDataCutError: false
      };
    }
    case fromAddDataCutActions.ADDING_DATA_CUT_SUCCESS: {
      return {
        ...state,
        addingDataCut: false,
        addingDataCutError: false
      };
    }
    case fromAddDataCutActions.ADDING_DATA_CUT_ERROR: {
      return {
        ...state,
        addingDataCut: false,
        addingDataCutError: true
      };
    }
    case fromAddDataCutActions.CANCEL_ADD_DATA_CUT: {
      return {
        ...state,
        addingDataCut: false,
        addingDataCutError: false
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getAddingDataCut = (state: State) => state.addingDataCut;
export const getAddingDataCutError = (state: State) => state.addingDataCutError;
