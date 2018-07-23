import * as fromAddSurveyDataPageActions from '../actions/add-survey-data-page.actions';

import { JobContext } from '../models';

export interface State {
  jobContext: JobContext;
  pageShown: boolean;
}

const initialState: State = {
  jobContext: null,
  pageShown: false
};

// Reducer function
export function reducer(state = initialState, action: fromAddSurveyDataPageActions.Actions): State {
  switch (action.type) {

    case fromAddSurveyDataPageActions.SET_JOB_CONTEXT: {
      return {
        ...state,
        jobContext: action.payload,
        pageShown: true
      };
    }
    case fromAddSurveyDataPageActions.CLOSE_SURVEY_SEARCH: {
      return {
        ...state,
        pageShown: false
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getJobContext = (state: State) => state.jobContext;
export const getPageShown = (state: State) => state.pageShown;
