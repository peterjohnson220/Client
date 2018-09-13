import * as fromAddSurveyDataPageActions from '../actions/add-survey-data-page.actions';

import { Filter, JobContext } from '../models';

export interface State {
  jobContext: JobContext;
  pageShown: boolean;
  addingData: boolean;
  addingDataError: boolean;
  searchingFilter: boolean;
}

const initialState: State = {
  jobContext: null,
  pageShown: false,
  addingData: false,
  addingDataError: false,
  searchingFilter: false
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
        pageShown: false,
        addingData: false,
        searchingFilter: false
      };
    }
    case fromAddSurveyDataPageActions.ADD_DATA: {
      return {
        ...state,
        addingData: true,
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
    case fromAddSurveyDataPageActions.TOGGLE_FILTER_SEARCH: {
      return {
        ...state,
        searchingFilter: !state.searchingFilter
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
export const getAddingData = (state: State) => state.addingData;
export const getSearchingFilter = (state: State) => state.searchingFilter;
