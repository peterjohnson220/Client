
import * as fromPayMarketsPageActions from '../actions/paymarkets-page.actions';

// Define our feature state
export interface State {
  loading: boolean;
}

// Define our initial state
const initialState: State = {
  loading: false
};

// Reducer function
export function reducer(state = initialState, action: fromPayMarketsPageActions.Actions): State {
  switch (action.type) {
    case fromPayMarketsPageActions.LOAD_PAYMARKETS: {
      return {
        ...state,
      };
    }
    default: {
      return state;
    }
  }
}
