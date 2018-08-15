import { Action } from '@ngrx/store';
import { CommunityPollResponse } from 'libs/models/community/community-poll-response.model';

export const LOADING_COMMUNITY_POLL_RESPONSES = '[Community/Poll Response] Loading Community Poll Responses';
export const LOADING_COMMUNITY_POLL_RESPONSES_SUCCESS  = '[Community/Poll Response] Loading Community Poll Responses Success';
export const LOADING_COMMUNITY_POLL_RESPONSES_ERROR  = '[Community/Poll Response] Loading Community Poll Responses Error';

export const DISMISSING_COMMUNITY_POLL_RESPONSE = '[Community/Poll Response] Dismissing Community Poll Response';
export const DISMISSING_COMMUNITY_POLL_RESPONSE_SUCCESS = '[Community/Poll Response] Dismissing Community Poll Response Success';
export const DISMISSING_COMMUNITY_POLL_RESPONSE_ERROR = '[Community/Poll Response] Dismissing Community Poll Response Error';

export class LoadingCommunityPollResponses implements Action {
  readonly type = LOADING_COMMUNITY_POLL_RESPONSES;
}

export class LoadingCommunityPollResponsesSuccess implements Action {
  readonly type = LOADING_COMMUNITY_POLL_RESPONSES_SUCCESS;
  constructor(public payload: CommunityPollResponse[]) {}
}

export class LoadingCommunityPollResponsesError implements Action {
  readonly type = LOADING_COMMUNITY_POLL_RESPONSES_ERROR;
}

export class DismissingCommunityPollResponse implements Action {
  readonly type = DISMISSING_COMMUNITY_POLL_RESPONSE;
  constructor(public payload: any) {}
}

export class DismissingCommunityPollResponseSuccess implements Action {
  readonly type = DISMISSING_COMMUNITY_POLL_RESPONSE_SUCCESS;
  constructor() {}
}
export class DismissingCommunityPollResponseError implements Action {
  readonly type = DISMISSING_COMMUNITY_POLL_RESPONSE_ERROR;
}

export type Actions
  = LoadingCommunityPollResponses
  | LoadingCommunityPollResponsesSuccess
  | LoadingCommunityPollResponsesError
  | DismissingCommunityPollResponse
  | DismissingCommunityPollResponseSuccess
  | DismissingCommunityPollResponseError;
