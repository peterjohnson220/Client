import { Action } from '@ngrx/store';
import { CommunityTag } from 'libs/models';

export const SUGGESTING_COMMUNITY_TAGS = '[Community/Tags] Suggesting Community Tags';
export const SUGGESTING_COMMUNITY_TAGS_SUCCESS = '[Community/Tags] Suggesting Community Tags Success';
export const SUGGESTING_COMMUNITY_TAGS_ERROR = '[Community/Tags] Suggesting Community Tags Error';

export class SuggestingCommunityTags implements Action {
    readonly type = SUGGESTING_COMMUNITY_TAGS;
    constructor(public payload: {query: string}) {}
}

export class SuggestingCommunityTagsSuccess implements Action {
    readonly type = SUGGESTING_COMMUNITY_TAGS_SUCCESS;
    constructor(public payload: CommunityTag[]) {}
}

export class SuggestingCommunityTagsError implements Action {
    readonly type = SUGGESTING_COMMUNITY_TAGS_ERROR;
}


export type Actions
  =  SuggestingCommunityTags
  | SuggestingCommunityTagsSuccess
  | SuggestingCommunityTagsError;


