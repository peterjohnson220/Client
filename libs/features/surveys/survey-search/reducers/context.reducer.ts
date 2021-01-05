import * as fromContextActions from '../actions/context.actions';

import {JobContext, PricingMatchDataSearchContext} from '../models';

export interface State {
  jobContext: JobContext;
  pricingMatchDataSearchContext: PricingMatchDataSearchContext;
}

const initialState: State = {
  jobContext: null,
  pricingMatchDataSearchContext: null
};

// Reducer function
export function reducer(state = initialState, action: fromContextActions.Actions): State {
  switch (action.type) {
    case fromContextActions.SET_JOB_CONTEXT: {
      return {
        ...state,
        jobContext: action.payload
      };
    }
    case fromContextActions.SET_PROJECT_SEARCH_CONTEXT:
    case fromContextActions.SET_MODIFY_PRICINGS_SEARCH_CONTEXT: {
      return {
        ...state,
        pricingMatchDataSearchContext: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getJobContext = (state: State) => state.jobContext;
export const getPricingMatchDataSearchContext  = (state: State) => state.pricingMatchDataSearchContext;
