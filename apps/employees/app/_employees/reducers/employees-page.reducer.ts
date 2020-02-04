// Import all exports from our feature's actions
import * as fromFeatureActions from '../actions/employees-page.actions';

// Define our feature state
export interface State {
  loading: boolean;
  loadingError: boolean;
}

// Define our initial state
const initialState: State = {
  loading: false,
  loadingError: false
};


// Reducer function
export function reducer(
  state = initialState,
  action: fromFeatureActions.Actions
): State {
  switch (action.type) {
    case fromFeatureActions.LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    case fromFeatureActions.LOADING_ERROR: {
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
