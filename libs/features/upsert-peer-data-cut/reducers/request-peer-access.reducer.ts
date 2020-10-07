import * as fromRequestPeerAccessActions from '../actions/request-peer-access.actions';

export interface State {
  requesting: boolean;
  requestingError: boolean;
}

// Initial State
export const initialState: State = {
  requesting: false,
  requestingError: false
};

// Reducer
export function reducer(
  state = initialState,
  action: fromRequestPeerAccessActions.RequestPeerAccessActions
): State {
  switch (action.type) {
    case fromRequestPeerAccessActions.REQUEST_PEER_ACCESS: {
      return {
        ...state,
        requesting: true,
        requestingError: false
      };
    }
    case fromRequestPeerAccessActions.REQUEST_PEER_ACCESS_SUCCESS: {
      return {
        ...state,
        requesting: false,
        requestingError: false
      };
    }
    case fromRequestPeerAccessActions.REQUEST_PEER_ACCESS_ERROR: {
      return {
        ...state,
        requesting: false,
        requestingError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getRequestingPeerAccess = (state: State) => state.requesting;
export const getRequestingPeerAccessError = (state: State) => state.requestingError;
