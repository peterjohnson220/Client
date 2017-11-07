import * as identityActions from '../actions/identity.actions';

export interface State {
  gettingIdentity: boolean;
  gettingIdentityError: boolean;
  identity: any;
}

export const initialState: State = {
  gettingIdentity: false,
  gettingIdentityError: false,
  identity: null
};

export function reducer(state = initialState, action: identityActions.Actions): State {
  switch (action.type){
    case identityActions.GET_IDENTITY: {
     return {
       ...state,
       gettingIdentity: true,
       gettingIdentityError: false,
       identity: null
     };
    }
    case identityActions.GET_IDENTITY_SUCCESS: {
      return {
        ...state,
        gettingIdentity: false,
        identity: action.payload
      };
    }
    case identityActions.GET_IDENTITY_ERROR: {
      return {
        ...state,
        gettingIdentity: false,
        gettingIdentityError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getGettingIdentity = (state: State) => state.gettingIdentity;
export const getGettingIdentityError = (state : State) => state.gettingIdentityError;
export const getIdentity = (state: State) => state.identity
