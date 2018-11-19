import * as fromAddSurveyDataPageActions from '../actions/add-survey-data-page.actions';

export interface State {
  addingData: boolean;
  addingDataError: boolean;
}

const initialState: State = {
  addingData: false,
  addingDataError: false
};

// Reducer function
export function reducer(state = initialState, action: fromAddSurveyDataPageActions.Actions): State {
  switch (action.type) {
    case fromAddSurveyDataPageActions.ADD_DATA: {
      return {
        ...state,
        addingData: true,
        addingDataError: false
      };
    }
    case fromAddSurveyDataPageActions.RESET_ADD_DATA: {
      return {
        ...state,
        addingData: false,
        addingDataError: false
      };
    }
    case fromAddSurveyDataPageActions.ADD_DATA_ERROR: {
      return {
        ...state,
        addingData: false,
        addingDataError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getAddingData = (state: State) => state.addingData;
