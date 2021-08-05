import * as fromAddSurveyDataActions from '../actions/add-data.actions';

export interface State {
  addingData: boolean;
  addingDataError: boolean;
  showModal: boolean;
}

const initialState: State = {
  addingData: false,
  addingDataError: false,
  showModal: false
};

// Reducer function
export function reducer(state = initialState, action: fromAddSurveyDataActions.Actions): State {
  switch (action.type) {
    case fromAddSurveyDataActions.ADD_DATA: {
      return {
        ...state,
        addingData: true,
        addingDataError: false
      };
    }
    case fromAddSurveyDataActions.RESET_ADD_DATA: {
      return {
        ...state,
        addingData: false,
        addingDataError: false
      };
    }
    case fromAddSurveyDataActions.ADD_DATA_ERROR: {
      return {
        ...state,
        addingData: false,
        addingDataError: true
      };
    }
    case fromAddSurveyDataActions.SET_ADD_DATA_MODAL_STATUS: {
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
export const getAddingData = (state: State) => state.addingData;
export const getShowModal = (state: State) => state.showModal;
