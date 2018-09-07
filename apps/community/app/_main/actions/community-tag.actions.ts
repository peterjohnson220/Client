import { Action } from '@ngrx/store';

export const LOADING_COMMUNITY_POPULAR_TAGS = '[Community/Tags] Loading Community Popular Tags';
export const LOADING_COMMUNITY_POPULAR_TAGS_SUCCESS = '[Community/Tags] Loading Community Popular Tags Success';
export const LOADING_COMMUNITY_POPULAR_TAGS_ERROR = '[Community/Tags] Loading Community Popular Tags Error';

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

export type Actions
  =  LoadingCommunityPopularTags
  | LoadingCommunityPopularTagsSuccess
  | LoadingCommunityPopularTagsError;

