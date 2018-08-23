import { Action } from '@ngrx/store';
import { CommunityPollUpsertRequest } from 'libs/models/community/community-poll-upsert-request.model';
import { CommunityPollList } from 'libs/models';

export const LOADING_COMMUNITY_POLLS  = '[Community/Poll] Loading Community Polls';
export const LOADING_COMMUNITY_POLLS_SUCCESS  = '[Community/Poll] Loading Community Polls Success';
export const LOADING_COMMUNITY_POLLS_ERROR  = '[Community/Poll] Loading Community Polls Error';
export const ADDING_COMMUNITY_POLL = '[Community/Poll] Adding Community Poll';
export const ADDING_COMMUNITY_POLL_SUCCESS = '[Community/Poll] Adding Community Poll Success';
export const ADDING_COMMUNITY_POLL_ERROR = '[Community/Poll] Adding Community Poll Error';
export const EDITING_COMMUNITY_POLL = '[Community/Poll] Editing Community Poll';
export const EDITING_COMMUNITY_POLL_SUCCESS = '[Community/Poll] Editing Community Poll Success';
export const EDITING_COMMUNITY_POLL_ERROR = '[Community/Poll] Editing Community Poll Error';
export const OPEN_COMMUNITY_POLL_MODAL = '[Community/Poll] Open Community Poll Modal';
export const CLOSE_COMMUNITY_POLL_MODAL = '[Community/Poll] Close Community Poll Modal';
export const EXPORTING_COMMUNITY_POLL = '[Community/Poll] Exporting Community Poll';
export const EXPORTING_COMMUNITY_POLL_SUCCESS = '[Community/Poll] Exporting Community Poll Success';
export const EXPORTING_COMMUNITY_POLL_ERROR = '[Community/Poll] Exporting Community Poll Error';

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

export class CloseCommunityPollModal implements Action {
    readonly type = CLOSE_COMMUNITY_POLL_MODAL;
}

export class OpenCommunityPollModal implements Action {
    readonly type = OPEN_COMMUNITY_POLL_MODAL;

    constructor(public payload?: CommunityPollList) {}
}

export class AddingCommunityPoll implements Action {
   readonly type = ADDING_COMMUNITY_POLL;

   constructor(public payload: CommunityPollUpsertRequest) {}
}

export class AddingCommunityPollSuccess implements Action {
   readonly type = ADDING_COMMUNITY_POLL_SUCCESS;
}

export class AddingCommunityPollError implements Action {
   readonly type = ADDING_COMMUNITY_POLL_ERROR;
   constructor(public payload: string) {}
}

export class EditingCommunityPoll implements Action {
    readonly type = EDITING_COMMUNITY_POLL;
    constructor(public payload: CommunityPollUpsertRequest) {}
 }

 export class EditingCommunityPollSuccess implements Action {
    readonly type = EDITING_COMMUNITY_POLL_SUCCESS;
 }

 export class EditingCommunityPollError implements Action {
    readonly type = EDITING_COMMUNITY_POLL_ERROR;
    constructor(public payload: string) {}
 }

export class ExportingCommunityPoll implements Action {
    readonly type = EXPORTING_COMMUNITY_POLL;

    constructor(public payload: string) {}
 }

 export class ExportingCommunityPollSuccess implements Action {
    readonly type = EXPORTING_COMMUNITY_POLL_SUCCESS;

    constructor(public payload: any) {}
 }

 export class ExportingCommunityPollError implements Action {
    readonly type = EXPORTING_COMMUNITY_POLL_ERROR;
    constructor(public payload: string) {}
 }


export type Actions
    = LoadingCommunityPolls
    | LoadingCommunityPollsSuccess
    | LoadingCommunityPollsError
    | OpenCommunityPollModal
    | CloseCommunityPollModal
    | AddingCommunityPoll
    | AddingCommunityPollSuccess
    | AddingCommunityPollError
    | ExportingCommunityPoll
    | ExportingCommunityPollSuccess
    | ExportingCommunityPollError
    | EditingCommunityPoll
    | EditingCommunityPollSuccess
    | EditingCommunityPollError;
