import * as communityPollResponseActions from '../actions/community-poll-response.actions';
import { CommunityPollResponse } from 'libs/models/community/community-poll-response.model';

export interface State {
  loadingResponses: boolean;
  loadingResponsesError: boolean;
  pollResponses: CommunityPollResponse[];
  dismissingResponse: boolean;
  dismissingResponseError: boolean;
  dismissedResponseSuccess: boolean;
}

export const initialState: State = {
  loadingResponses: false,
  loadingResponsesError: false,
  pollResponses: [],
  dismissingResponse: false,
  dismissingResponseError: false,
  dismissedResponseSuccess: false
};

export function reducer(state = initialState, action: communityPollResponseActions.Actions): State {
  switch (action.type) {
    case communityPollResponseActions.LOADING_COMMUNITY_POLL_RESPONSES: {
      return {
        ...state,
        loadingResponses: true,
        loadingResponsesError: false,
        pollResponses: []
      };
    }
    case communityPollResponseActions.LOADING_COMMUNITY_POLL_RESPONSES_SUCCESS: {
      return {
        ...state,
        loadingResponses: false,
        pollResponses: action.payload
      };
    }
    case communityPollResponseActions.LOADING_COMMUNITY_POLL_RESPONSES_ERROR: {
      return {
        ...state,
        loadingResponses: false,
        loadingResponsesError: true
      };
    }
    case communityPollResponseActions.DISMISSING_COMMUNITY_POLL_RESPONSE: {
      return {
        ...state,
        dismissingResponse: true,
        dismissingResponseError: false
      };
    }
    case communityPollResponseActions.DISMISSING_COMMUNITY_POLL_RESPONSE_SUCCESS: {
      return {
        ...state,
        dismissingResponse: false,
        dismissingResponseError: false,
        dismissedResponseSuccess: true
      };
    }
    case communityPollResponseActions.DISMISSING_COMMUNITY_POLL_RESPONSE_ERROR: {
      return {
        ...state,
        dismissingResponse: false,
        dismissingResponseError: true,
        dismissedResponseSuccess: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getGettingCommunityPollResponses = (state: State) => state.loadingResponses;
export const getGettingCommunityPollResponsesSuccess = (state: State) => state.pollResponses;
export const getGettingCommunityPollResponsesError = (state: State) => state.loadingResponsesError;

export const getDismissingCommunityPollResponse = (state: State) => state.dismissingResponse;
export const getDismissingCommunityPollResponseSuccess = (state: State) => state.dismissedResponseSuccess;
export const getDismissingCommunityPollResponseError = (state: State) => state.dismissingResponseError;
