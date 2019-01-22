import { Action } from '@ngrx/store';

export const LOADING_COMMUNITY_LIKES = '[Community/Like] Loading Community Likes';
export const LOADING_COMMUNITY_LIKES_SUCCESS = '[Community/Like] Loading Community Likes Success';
export const LOADING_COMMUNITY_LIKES_ERROR = '[Community/Like] Loading Community Likes Error';


export class LoadingCommunityLikes implements Action {
    readonly type = LOADING_COMMUNITY_LIKES;
    constructor(public payload: any) {}
  }

export class LoadingCommunityLikesSuccess implements Action {
    readonly type = LOADING_COMMUNITY_LIKES_SUCCESS;
    constructor(public payload: any) {}
  }

  export class LoadingCommunityLikesError implements Action {
    readonly type = LOADING_COMMUNITY_LIKES_ERROR;
}

export type Actions
  =  LoadingCommunityLikes
  | LoadingCommunityLikesSuccess
  | LoadingCommunityLikesError;
