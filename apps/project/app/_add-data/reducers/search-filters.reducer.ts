import * as fromSearchFiltersActions from '../actions/search-filters.actions';

interface StaticFilters {
  jobTitleCode: string;
  jobDescription: string;
  scope: string;
}

export interface State {
  staticFilters: StaticFilters;
}

const initialState: State = {
  staticFilters: {
    jobTitleCode: '',
    jobDescription: '',
    scope: ''
  }
};

// Reducer function
export function reducer(state = initialState, action: fromSearchFiltersActions.Actions): State {
  switch (action.type) {
    case fromSearchFiltersActions.CLEAR_STATIC_FILTERS: {
      return {
        ...initialState
      };
    }
    case fromSearchFiltersActions.UPDATE_STATIC_FILTER_VALUE: {
      return {
        ...state,
        staticFilters: {
          ...state.staticFilters,
          [ action.payload.Field ]: action.payload.Value
        }
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getStaticFilters = (state: State) => state.staticFilters;
