import cloneDeep from 'lodash/cloneDeep';

import * as communityPollRequestActions from '../actions/community-poll-request.actions';
import { CommunityPollRequest } from 'libs/models/community/community-poll-request.model';

export interface State {
  loading: boolean;
  loadingError: boolean;
  loaded: boolean;
  entities: CommunityPollRequest[];
  submitting: boolean;
  submitted: boolean;
  questionsSubmitted: any;
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  loaded: false,
  entities: [],
  submitting: false,
  submitted: false,
  questionsSubmitted: null
};

export function reducer(state = initialState, action: communityPollRequestActions.Actions): State {
  switch (action.type) {
    case communityPollRequestActions.LOADING_COMMUNITY_POLL_REQUEST: {
      return {
        ...state,
        loading: true,
        loaded: false,
        loadingError: false,
        entities: []
      };
    }
    case communityPollRequestActions.LOADING_COMMUNITY_POLL_REQUEST_SUCCESS: {
      return {
        ...state,
        loading: false,
        loaded: true,
        entities: cloneDeep(action.payload)
      };
    }
    case communityPollRequestActions.LOADING_COMMUNITY_POLL_REQUEST_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case communityPollRequestActions.SUBMITTING_COMMUNITY_POLL_REQUEST_RESPONSE: {
      return {
        ...state,
        submitting: true,
        submitted: false
      };
    }
    case communityPollRequestActions.SUBMITTING_COMMUNITY_POLL_REQUEST_RESPONSE_SUCCESS: {
      return {
        ...state,
        submitting: false,
        submitted: true,
        questionsSubmitted: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

export const getGettingCommunityPollRequests = (state: State) => state.loading;
export const getGettingCommunityPollRequestsError = (state: State) => state.loadingError;
export const getGettingCommunityPollRequestsLoaded = (state: State) => state.loaded;
export const getCommunityPollRequests = (state: State) => state.entities;
export const getSubmittingCommunityPollRequestResponses = (state: State) => state.questionsSubmitted;
export const getSubmittingCommunityPollRequestResponse = (state: State ) => state.submitting;

