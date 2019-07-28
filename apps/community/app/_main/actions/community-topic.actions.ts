import { Action } from '@ngrx/store';
import { CommunityTopic } from 'libs/models/community';

export const LOADING_COMMUNITY_TOPICS = '[Community/Topics] Loading Community Topics';
export const LOADING_COMMUNITY_TOPICS_SUCCESS = '[Community/Topics] Loading Community Topics Success';
export const LOADING_COMMUNITY_TOPICS_ERROR = '[Community/Topics] Loading Community Topics Error';

export class LoadingCommunityTopics implements Action {
  readonly type = LOADING_COMMUNITY_TOPICS;
  constructor() {}
}

export class LoadingCommunityTopicsSuccess implements Action {
  readonly type = LOADING_COMMUNITY_TOPICS_SUCCESS;
  constructor(public payload: CommunityTopic[]) {}
}

export class LoadingCommunityTopicsError implements Action {
  readonly type = LOADING_COMMUNITY_TOPICS_ERROR;
}

export type Actions
  =  LoadingCommunityTopics
  | LoadingCommunityTopicsSuccess
  | LoadingCommunityTopicsError;
