// Import all exports from our feature's actions
import * as fromCompanyJobActions from '../actions/company-job.actions';
import { CompanyJob } from 'libs/models/company/company-job.model';

// Define our feature state
export interface State {
  loading: boolean;
  loadingError: boolean;
  companyJob: CompanyJob;
}

// Define our initial state
const initialState: State = ({
  loading: false,
  loadingError: false,
  companyJob: null
});

// Reducer function
export function reducer(
  state = initialState,
  action: fromCompanyJobActions.Actions
): State {
  switch (action.type) {
    case fromCompanyJobActions.LOADING: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromCompanyJobActions.LOADING_SUCCESS: {
      return {
        ...state,
        companyJob: action.payload[0],
        loading: false,
        loadingError: false
      };
    }
    case fromCompanyJobActions.LOADING_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getCompanyJob = (state: State) => state.companyJob;
