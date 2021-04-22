import * as fromSurveysPageActions from '../actions/surveys-page.actions';

// Define our feature state
export interface State {
  loading: boolean;
}

// Define our initial state
const initialState: State = {
  loading: false
};

// Reducer function
export function reducer(state = initialState, action: fromSurveysPageActions.Actions): State {
  switch (action.type) {
    default: {
      return state;
    }
  }
}
