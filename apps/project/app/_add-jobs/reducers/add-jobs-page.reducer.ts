import * as fromAddJobsPageActions from '../actions/add-jobs.page.actions';

export interface State {
  pageShown: boolean;
}

const initialState: State = {
  pageShown: false
};

// Reducer function
export function reducer(state = initialState, action: fromAddJobsPageActions.Actions): State {
  switch (action.type) {

    case fromAddJobsPageActions.CLOSE_JOBS_SEARCH: {
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
export const getPageShown = (state: State) => state.pageShown;
