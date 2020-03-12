// Import all exports from our feature's actions
import * as fromEmployeesPageActions from '../actions/employees-page.actions';

// Define our feature state
export interface State {
  pricingJobs: boolean;
  pricingJobsError: boolean;
}

// Define our initial state
const initialState: State = {
  pricingJobs: false,
  pricingJobsError: false
};


// Reducer function
export function reducer(state = initialState, action: fromEmployeesPageActions.Actions): State {
  switch (action.type) {
    case fromEmployeesPageActions.PRICE_JOBS: {
      return {
        ...state,
        pricingJobs: true
      };
    }
    case fromEmployeesPageActions.PRICE_JOBS_ERROR: {
      return {
        ...state,
        pricingJobsError: true
      };
    }
    case fromEmployeesPageActions.RESET_PRICING_JOBS_STATUS: {
      return {
        ...state,
        pricingJobs: false,
        pricingJobsError: false
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getPricingJobs = (state: State) => state.pricingJobs;
export const getPricingsJobsError = (state: State) => state.pricingJobsError;
