import * as fromAddJobsPageActions from '../actions/add-jobs.page.actions';

export interface State {
  context: { PayMarketId: number, ProjectId: number};
}

const initialState: State = {
  context: null
};

// Reducer function
export function reducer(state = initialState, action: fromAddJobsPageActions.Actions): State {
  switch (action.type) {

    case fromAddJobsPageActions.SET_CONTEXT: {
      return {
        ...state,
        context: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getContext = (state: State) => state.context;
