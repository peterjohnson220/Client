import { Action } from '@ngrx/store';
import { CommunityPoll } from 'libs/models/community/community-poll.model';
import { CommunityPollRequest } from 'libs/models/community/community-poll-request';

export const LOADING_COMMUNITY_POLLS  = '[Community/Poll] Loading Community Polls';
export const LOADING_COMMUNITY_POLLS_SUCCESS  = '[Community/Poll] Loading Community Polls Success';
export const LOADING_COMMUNITY_POLLS_ERROR  = '[Community/Poll] Loading Community Polls Error';
export const ADDING_COMMUNITY_POLL = '[Community/Poll] Adding Community Poll';
export const ADDING_COMMUNITY_POLL_SUCCESS = '[Community/Poll] Adding Community Poll Success';
export const ADDING_COMMUNITY_POLL_ERROR = '[Community/Poll] Adding Community Poll Error';
export const OPEN_ADD_COMMUNITY_POLL_MODAL = '[Community/Poll] Open Add Community Poll Modal';
export const CLOSE_ADD_COMMUNITY_POLL_MODAL = '[Community/Poll] Close Add Community Poll Modal';

export class LoadingCommunityPolls implements Action {
    readonly type = LOADING_COMMUNITY_POLLS;
}

export class LoadingCommunityPollsSuccess implements Action {
    readonly type = LOADING_COMMUNITY_POLLS_SUCCESS;
    constructor(public payload: CommunityPoll[]) {}
}

export class LoadingCommunityPollsError implements Action {
    readonly type = LOADING_COMMUNITY_POLLS_ERROR;
}

export class OpenAddCommunityPollModal implements Action {
    readonly type = OPEN_ADD_COMMUNITY_POLL_MODAL;
}

export class CloseAddCommunityPollModal implements Action {
    readonly type = CLOSE_ADD_COMMUNITY_POLL_MODAL;
}

export class AddingCommunityPoll implements Action {
   readonly type = ADDING_COMMUNITY_POLL;

   constructor(public payload: CommunityPollRequest) {}
}

export class AddingCommunityPollSuccess implements Action {
   readonly type = ADDING_COMMUNITY_POLL_SUCCESS;

   constructor(public payload: CommunityPoll) {}
}

export class AddingCommunityPollError implements Action {
   readonly type = ADDING_COMMUNITY_POLL_ERROR;
   constructor(public payload: string) {}
}

export type Actions
    = LoadingCommunityPolls
    | LoadingCommunityPollsSuccess
    | LoadingCommunityPollsError
    | OpenAddCommunityPollModal
    | CloseAddCommunityPollModal
    | AddingCommunityPoll
    | AddingCommunityPollSuccess
    | AddingCommunityPollError;
