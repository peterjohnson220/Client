import * as fromAddDataCutPageActions from '../actions/add-data-cut-page.actions';

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
  action: fromAddDataCutPageActions.Actions
): State {
  switch (action.type) {
    case fromAddDataCutPageActions.ADDING_DATA_CUT: {
      return {
        ...state,
        addingDataCut: true,
        addingDataCutError: false
      };
    }
    case fromAddDataCutPageActions.ADDING_DATA_CUT_SUCCESS: {
      return {
        ...state,
        addingDataCut: false,
        addingDataCutError: false
      };
    }
    case fromAddDataCutPageActions.ADDING_DATA_CUT_ERROR: {
      return {
        ...state,
        addingDataCut: false,
        addingDataCutError: true
      };
    }
    case fromAddDataCutPageActions.CANCEL_ADD_DATA_CUT: {
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
