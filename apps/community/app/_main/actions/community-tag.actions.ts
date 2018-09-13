import { Action } from '@ngrx/store';
import { CommunityTag } from 'libs/models';

export const LOADING_COMMUNITY_POPULAR_TAGS = '[Community/Tags] Loading Community Popular Tags';
export const LOADING_COMMUNITY_POPULAR_TAGS_SUCCESS = '[Community/Tags] Loading Community Popular Tags Success';
export const LOADING_COMMUNITY_POPULAR_TAGS_ERROR = '[Community/Tags] Loading Community Popular Tags Error';

export const SUGGESTING_COMMUNITY_TAGS = '[Community/Tags] Suggesting Community Tags';
export const SUGGESTING_COMMUNITY_TAGS_SUCCESS = '[Community/Tags] Suggesting Community Tags Success';
export const SUGGESTING_COMMUNITY_TAGS_ERROR = '[Community/Tags] Suggesting Community Tags Error';

export class LoadingCommunityPopularTags implements Action {
  readonly type = LOADING_COMMUNITY_POPULAR_TAGS;
}

export class LoadingCommunityPopularTagsSuccess implements Action {
  readonly type = LOADING_COMMUNITY_POPULAR_TAGS_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadingCommunityPopularTagsError implements Action {
  readonly type = LOADING_COMMUNITY_POPULAR_TAGS_ERROR;
}

export class SuggestingCommunityTags implements Action {
    readonly type = SUGGESTING_COMMUNITY_TAGS;
    constructor(public payload: {query: string, postId: string}) {}
}

export class SuggestingCommunityTagsSuccess implements Action {
    readonly type = SUGGESTING_COMMUNITY_TAGS_SUCCESS;
    constructor(public payload: CommunityTag[]) {}
}

export class SuggestingCommunityTagsError implements Action {
    readonly type = SUGGESTING_COMMUNITY_TAGS_ERROR;
}


export type Actions
  =  LoadingCommunityPopularTags
  | LoadingCommunityPopularTagsSuccess
  | LoadingCommunityPopularTagsError
  | SuggestingCommunityTags
  | SuggestingCommunityTagsSuccess
  | SuggestingCommunityTagsError;


