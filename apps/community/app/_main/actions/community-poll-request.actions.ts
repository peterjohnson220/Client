import { Action } from '@ngrx/store';
import { CommunityPollRequest } from 'libs/models/community/community-poll-request.model';
import { CommunityPollUpsertRequest } from 'libs/models/community/community-poll-upsert-request.model';

export const LOADING_COMMUNITY_POLL_REQUEST = '[Community/Poll Request] Loading Community Polls';
export const LOADING_COMMUNITY_POLL_REQUEST_SUCCESS  = '[Community/Poll Request] Loading Community Polls Success';
export const LOADING_COMMUNITY_POLL_REQUEST_ERROR  = '[Community/Poll Request] Loading Community Polls Error';
export const SUBMITTING_COMMUNITY_POLL_REQUEST_RESPONSE = '[Community/Poll Request] Submitting Community Poll Request Response';
export const SUBMITTING_COMMUNITY_POLL_REQUEST_RESPONSE_SUCCESS =
'[Community/Poll Request] Submitting Community Poll Request Response Success';
export const SUBMITTING_COMMUNITY_POLL_REQUEST_RESPONSE_ERROR =
  '[Community/Poll Request] Submitting Community Poll Request Response Error';

export const ADDING_COMMUNITY_USER_POLL = '[Community/Poll Request] Adding Community User Poll';
export const ADDING_COMMUNITY_USER_POLL_SUCCESS = '[Community/Poll Request] Adding Community User Poll Success';
export const ADDING_COMMUNITY_USER_POLL_ERROR = '[Community/Poll Request] Adding Community User Poll Error';

export class LoadingCommunityPollRequests implements Action {
  readonly type = LOADING_COMMUNITY_POLL_REQUEST;
}

export class LoadingCommunityPollRequestsSuccess implements Action {
  readonly type = LOADING_COMMUNITY_POLL_REQUEST_SUCCESS;
  constructor(public payload: CommunityPollRequest[]) {}
}

export class LoadingCommunityPollRequestsError implements Action {
  readonly type = LOADING_COMMUNITY_POLL_REQUEST_ERROR;
}

export class SubmittingCommunityPollRequest implements Action {
  readonly type = SUBMITTING_COMMUNITY_POLL_REQUEST_RESPONSE;
  constructor(public payload: any) {}
}

export class SubmittingCommunityPollRequestSuccess implements Action {
  readonly type = SUBMITTING_COMMUNITY_POLL_REQUEST_RESPONSE_SUCCESS;
  constructor(public payload: any) {}
}
export class SubmittingCommunityPollRequestError implements Action {
  readonly type = SUBMITTING_COMMUNITY_POLL_REQUEST_RESPONSE_ERROR;
}

export class AddingCommunityUserPoll implements Action {
  readonly type = ADDING_COMMUNITY_USER_POLL;

  constructor(public payload: CommunityPollUpsertRequest) {}
}

export class AddingCommunityUserPollSuccess implements Action {
  readonly type = ADDING_COMMUNITY_USER_POLL_SUCCESS;
}

export class AddingCommunityUserPollError implements Action {
  readonly type = ADDING_COMMUNITY_USER_POLL_ERROR;
  constructor(public payload: string) {}
}

export type Actions
  = LoadingCommunityPollRequests
  | LoadingCommunityPollRequestsSuccess
  | LoadingCommunityPollRequestsError
  | SubmittingCommunityPollRequest
  | SubmittingCommunityPollRequestSuccess
  | SubmittingCommunityPollRequestError
  | AddingCommunityUserPoll
  | AddingCommunityUserPollSuccess
  | AddingCommunityUserPollError;
