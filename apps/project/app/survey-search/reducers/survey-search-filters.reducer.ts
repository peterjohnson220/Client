import * as fromSearchFiltersActions from '../actions/survey-search-filters.actions';

export interface State {
  loadingDefaultSurveyScopes: boolean;
}

const initialState: State = {
  loadingDefaultSurveyScopes: false
};

// Reducer function
export function reducer(state = initialState, action: fromSearchFiltersActions.Actions): State {
  switch (action.type) {
    case fromSearchFiltersActions.GET_DEFAULT_SURVEY_SCOPES_FILTER: {
      return {
        ...state,
        loadingDefaultSurveyScopes: true
      };
    }
    case fromSearchFiltersActions.GET_DEFAULT_SURVEY_SCOPES_FILTER_SUCCESS: {
      return {
        ...state,
        loadingDefaultSurveyScopes: false
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getLoadingDefaultSurveyScopes = (state: State) => state.loadingDefaultSurveyScopes;
