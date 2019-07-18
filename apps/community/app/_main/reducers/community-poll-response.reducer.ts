import * as communityPollResponseActions from '../actions/community-poll-response.actions';
import { CommunityPollResponse } from 'libs/models/community/community-poll-response.model';

export interface State {
  loadingResponses: boolean;
  loadingResponsesError: boolean;
  pollResponses: CommunityPollResponse[];
  dismissingResponse: boolean;
  dismissingResponseError: boolean;
  dismissedResponseSuccess: boolean;
  exportingUserPollResponses: boolean;
  exportingUserPollResponsesSuccess: boolean;
  exportingUserPollResponsesError: boolean;
  dismissedByUser: string[];
}

export const initialState: State = {
  loadingResponses: false,
  loadingResponsesError: false,
  pollResponses: [],
  dismissingResponse: false,
  dismissingResponseError: false,
  dismissedResponseSuccess: false,
  exportingUserPollResponses: false,
  exportingUserPollResponsesSuccess: null,
  exportingUserPollResponsesError: false,
  dismissedByUser: []
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
        dismissedByUser: state.dismissedByUser.concat(action.payload),
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
    case communityPollResponseActions.EXPORTING_COMMUNITY_USER_POLL_RESPONSES: {
      return {
        ...state,
        exportingUserPollResponses: true,
        exportingUserPollResponsesSuccess: false,
        exportingUserPollResponsesError: false
      };
    }
    case communityPollResponseActions.EXPORTING_COMMUNITY_USER_POLL_RESPONSES_SUCCESS: {
      return {
        ...state,
        exportingUserPollResponses: false,
        exportingUserPollResponsesSuccess: true,
        exportingUserPollResponsesError: false
      };
    }
    case communityPollResponseActions.EXPORTING_COMMUNITY_USER_POLL_RESPONSES_ERROR: {
      return {
        ...state,
        exportingUserPollResponses: false,
        exportingUserPollResponsesSuccess: false,
        exportingUserPollResponsesError: true
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
export const getDismissedResponses = (state: State) => state.dismissedByUser;
