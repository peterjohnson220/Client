import * as fromJobPeerMatchesActions from '../actions';

export interface State {
  jobId: number;
  peerMatchesLoaded: boolean;
  peerMatches: [];
}

export const initialState: State = {
  jobId: null,
  peerMatchesLoaded: false,
  peerMatches: undefined

};

export function reducer(state = initialState, action: fromJobPeerMatchesActions.JobPeerMatchesActions): State {
  switch (action.type) {
    case fromJobPeerMatchesActions.LOAD_JOB_PEER_MATCHES_SUCCESS: {
      return {
        ...state,
        peerMatchesLoaded: true,
        peerMatches: action.payload
      };
    }
    case fromJobPeerMatchesActions.LOAD_JOB_PEER_MATCHES: {
      return {
        ...state,
        peerMatchesLoaded: false
      };
    }
    default: {
      return state;
    }
  }
}
export const getPeerMatches = (state: State) => state.peerMatches;
export const getPeerMatchesLoaded = (state: State) => state.peerMatchesLoaded;





