import * as fromUserSettingsPageActions from '../actions/user-settings-page.actions';

// Define our feature state
export interface State {
  loading: boolean;
}

// Define our initial state
const initialState: State = {
  loading: false
};

// Reducer function
export function reducer(state = initialState, action: fromUserSettingsPageActions.Actions): State {
  switch (action.type) {
    case fromUserSettingsPageActions.LOAD_USER_SETTINGS: {
      return {
        ...state,
      };
    }
    default: {
      return state;
    }
  }
}
