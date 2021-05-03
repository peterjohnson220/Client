import * as fromSurveysPageActions from '../actions/surveys-page.actions';

// Define our feature state
export interface State {
  surveyFieldsModalOpen: boolean;
}

// Define our initial state
const initialState: State = {
  surveyFieldsModalOpen: false
};

// Reducer function
export function reducer(state = initialState, action: fromSurveysPageActions.Actions): State {
  switch (action.type) {
    case fromSurveysPageActions.OPEN_SURVEY_FIELDS_MODAL: {
      return {
        ...state,
        surveyFieldsModalOpen: true
      };
    }
    case fromSurveysPageActions.CLOSE_SURVEY_FIELDS_MODAL: {
      return {
        ...state,
        surveyFieldsModalOpen: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getSurveyFieldsModalOpen = (state: State) => state.surveyFieldsModalOpen;
