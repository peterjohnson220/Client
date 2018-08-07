import { Action } from '@ngrx/store';
import { CommunityPollAddRequest } from 'libs/models/community/community-poll-add-request.model';
import { CommunityPollUpdateStatusRequest } from 'libs/models/community/community-poll-update-status-request.model';

export const LOADING_COMMUNITY_POLLS  = '[Community/Poll] Loading Community Polls';
export const LOADING_COMMUNITY_POLLS_SUCCESS  = '[Community/Poll] Loading Community Polls Success';
export const LOADING_COMMUNITY_POLLS_ERROR  = '[Community/Poll] Loading Community Polls Error';
export const ADDING_COMMUNITY_POLL = '[Community/Poll] Adding Community Poll';
export const ADDING_COMMUNITY_POLL_SUCCESS = '[Community/Poll] Adding Community Poll Success';
export const ADDING_COMMUNITY_POLL_ERROR = '[Community/Poll] Adding Community Poll Error';
export const OPEN_ADD_COMMUNITY_POLL_MODAL = '[Community/Poll] Open Add Community Poll Modal';
export const CLOSE_ADD_COMMUNITY_POLL_MODAL = '[Community/Poll] Close Add Community Poll Modal';
export const UPDATING_COMMUNITY_POLL_STATUS = '[Community/Poll] Updating Community Poll Status';
export const UPDATING_COMMUNITY_POLL_STATUS_SUCCESS  = '[Community/Poll] Updating Community Poll Status Success';
export const UPDATING_COMMUNITY_POLL_STATUS_ERROR = '[Community/Poll] Updating Community Poll Status Error';

export class LoadingCommunityPolls implements Action {
    readonly type = LOADING_COMMUNITY_POLLS;
}

export class LoadingCommunityPollsSuccess implements Action {
    readonly type = LOADING_COMMUNITY_POLLS_SUCCESS;
    constructor(public payload: any) {}
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

   constructor(public payload: CommunityPollAddRequest) {}
}

export class AddingCommunityPollSuccess implements Action {
   readonly type = ADDING_COMMUNITY_POLL_SUCCESS;
}

export class AddingCommunityPollError implements Action {
   readonly type = ADDING_COMMUNITY_POLL_ERROR;
   constructor(public payload: string) {}
}

export class UpdatingCommunityPollStatus implements Action {
    readonly type = UPDATING_COMMUNITY_POLL_STATUS;

    constructor(public payload: CommunityPollUpdateStatusRequest) {}
}

 export class UpdatingCommunityPollStatusSuccess implements Action {
    readonly type = UPDATING_COMMUNITY_POLL_STATUS_SUCCESS;
}

 export class UpdatingCommunityPollStatusError implements Action {
    readonly type = UPDATING_COMMUNITY_POLL_STATUS_ERROR;
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
    | AddingCommunityPollError
    | UpdatingCommunityPollStatus
    | UpdatingCommunityPollStatusSuccess
    | UpdatingCommunityPollStatusError;
