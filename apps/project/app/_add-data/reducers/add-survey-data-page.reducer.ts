import * as fromAddSurveyDataPageActions from '../actions/add-survey-data-page.actions';

import { SearchFilter } from 'libs/models/search';

import { JobContext } from '../models';

export interface State {
  jobContext: JobContext;
  loadingDefaultSurveyScopes: boolean;
  filters: SearchFilter[];
}

const initialState: State = {
  jobContext: null,
  loadingDefaultSurveyScopes: false,
  filters: []
};

// Reducer function
export function reducer(state = initialState, action: fromAddSurveyDataPageActions.Actions): State {
  switch (action.type) {
    case fromAddSurveyDataPageActions.GET_DEFAULT_SURVEY_SCOPES_FILTER: {
      return {
        ...state,
        loadingDefaultSurveyScopes: true
      };
    }
    case fromAddSurveyDataPageActions.GET_DEFAULT_SURVEY_SCOPES_FILTER_SUCCESS: {
      return {
        ...state,
        loadingDefaultSurveyScopes: false,
        filters: [...state.filters, action.payload]
      };
    }
    case fromAddSurveyDataPageActions.SET_JOB_CONTEXT: {
      return {
        ...state,
        jobContext: action.payload,
        filters: []
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getLoadingDefaultSurveyScopes = (state: State) => state.loadingDefaultSurveyScopes;
export const getFilters = (state: State) => state.filters;
export const getJobContext = (state: State) => state.jobContext;
