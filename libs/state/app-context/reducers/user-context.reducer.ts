import * as userContextActions from '../actions/user-context.actions';

import { UserContext } from '../../../models/';

export interface State {
  gettingUserContext: boolean;
  gettingUserContextError: boolean;
  gettingUserContextAttempted: boolean;
  userContext: UserContext;
}

export const initialState: State = {
  gettingUserContext: false,
  gettingUserContextError: false,
  gettingUserContextAttempted: false,
  userContext: null
};

export function reducer(state = initialState, action: userContextActions.Actions): State {
  switch (action.type) {
    case userContextActions.GET_USER_CONTEXT: {
     return {
       ...state,
       gettingUserContext: true,
       gettingUserContextError: false,
       userContext: null
     };
    }
    case userContextActions.GET_USER_CONTEXT_SUCCESS: {
      return {
        ...state,
        gettingUserContext: false,
        gettingUserContextAttempted: true,
        userContext: action.payload
      };
    }
    case userContextActions.GET_USER_CONTEXT_ERROR: {
      return {
        ...state,
        gettingUserContext: false,
        gettingUserContextAttempted: true,
        gettingUserContextError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getGettingUserContext = (state: State) => state.gettingUserContext;
export const getGettingUserContextError = (state: State) => state.gettingUserContextError;
export const getGettingUserContextAttempted = (state: State) => state.gettingUserContextAttempted;
export const getUserContext = (state: State) => state.userContext;
