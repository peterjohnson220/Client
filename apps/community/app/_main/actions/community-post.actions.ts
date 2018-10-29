import { Action } from '@ngrx/store';
import { CommunityPollUpsertRequest } from 'libs/models/community/community-poll-upsert-request.model';

export const SUBMITTING_COMMUNITY_POST = '[Community/Post] Submitting Community Post';
export const SUBMITTING_COMMUNITY_POST_SUCCESS = '[Community/Post] Submitting Community Post Success';
export const SUBMITTING_COMMUNITY_POST_ERROR = '[Community/Post] Submitting Community Post Error';

export const GETTING_COMMUNITY_POSTS = '[Community/Post] Get Community Posts';
export const GETTING_COMMUNITY_POSTS_SUCCESS = '[Community/Post] Get Community Posts Success';
export const GETTING_COMMUNITY_POSTS_ERROR = '[Community/Post] Get Community Posts Error';


export const UPDATING_COMMUNITY_POST_LIKE = '[Community/Post] Updating Community Post Like';
export const UPDATING_COMMUNITY_POST_LIKE_SUCCESS = '[Community/Post] Updating Community Post Like Success';
export const UPDATING_COMMUNITY_POST_LIKE_ERROR = '[Community/Post] Updating Community Post Like Error';

export const UPDATING_COMMUNITY_POST_REPLY_IDS = '[Community/Post] Updating Community Post Reply Ids';
export const UPDATING_COMMUNITY_POST_HIDDEN_REPLY_IDS = '[Community/Post] Updating Community Post Hidden Reply Ids';

export const DELETING_COMMUNITY_POST = '[Community/Post] Deleting Community Post';
export const DELETING_COMMUNITY_POST_SUCCESS = '[Community/Post] Deleting Community Post Success';
export const DELETING_COMMUNITY_POST_ERROR = '[Community/Post] Deleting Community Post Error';

export const ADDING_COMMUNITY_DISCUSSION_POLL = '[Community/Post] Adding Community Discussion Poll';
export const ADDING_COMMUNITY_DISCUSSION_POLL_SUCCESS = '[Community/Post] Adding Community Discussion Poll Success';
export const ADDING_COMMUNITY_DISCUSSION_POLL_ERROR = '[Community/Post] Adding Community Discussion Poll Error';

export class SubmittingCommunityPost implements Action {
  readonly type = SUBMITTING_COMMUNITY_POST;
  constructor(public payload: any) {}
}

export class SubmittingCommunityPostSuccess implements Action {
  readonly type = SUBMITTING_COMMUNITY_POST_SUCCESS;
  constructor(public payload: any) {}
}

export class SubmittingCommunityPostError implements Action {
  readonly type = SUBMITTING_COMMUNITY_POST_ERROR;
}

export class GettingCommunityPosts implements Action {
  readonly type = GETTING_COMMUNITY_POSTS;
}

export class GettingCommunityPostsSuccess implements Action {
  readonly type = GETTING_COMMUNITY_POSTS_SUCCESS;
  constructor(public payload: any) {}
}

export class GettingCommunityPostsError implements Action {
  readonly type = GETTING_COMMUNITY_POSTS_ERROR;
}

export class UpdatingCommunityPostLike implements Action {
  readonly type = UPDATING_COMMUNITY_POST_LIKE;
  constructor(public payload: any) {}
}

export class UpdatingCommunityPostLikeSuccess implements Action {
  readonly type = UPDATING_COMMUNITY_POST_LIKE_SUCCESS;
  constructor(public payload: any) {}
}

export class UpdatingCommunityPostLikeError implements Action {
  readonly type = UPDATING_COMMUNITY_POST_LIKE_ERROR;
}

export class UpdatingCommunityPostReplyIds implements Action {
  readonly type = UPDATING_COMMUNITY_POST_REPLY_IDS;
  constructor(public payload: any) {}
}

export class UpdatingCommunityPostHiddenReplyIds implements Action {
  readonly type = UPDATING_COMMUNITY_POST_HIDDEN_REPLY_IDS;
  constructor(public payload: any) {}
}

export class DeletingCommunityPost implements Action {
  readonly type = DELETING_COMMUNITY_POST;
  constructor(public payload: any) {}
}

export class DeletingCommunityPostSuccess implements Action {
  readonly type = DELETING_COMMUNITY_POST_SUCCESS;
  constructor(public payload: any) {}
}

export class DeletingCommunityPostError implements Action {
  readonly type = DELETING_COMMUNITY_POST_ERROR;
}

export class AddingCommunityDiscussionPoll implements Action {
  readonly type = ADDING_COMMUNITY_DISCUSSION_POLL;

  constructor(public payload: CommunityPollUpsertRequest) {}
}

export class AddingCommunityDiscussionPollSuccess implements Action {
  readonly type = ADDING_COMMUNITY_DISCUSSION_POLL_SUCCESS;
  constructor(public payload: any) {}
}

export class AddingCommunityDiscussionPollError implements Action {
  readonly type = ADDING_COMMUNITY_DISCUSSION_POLL_ERROR;
  constructor(public payload: string) {}
}

export type Actions
  =  SubmittingCommunityPost
  | SubmittingCommunityPostSuccess
  | SubmittingCommunityPostError
  | GettingCommunityPosts
  | GettingCommunityPostsSuccess
  | GettingCommunityPostsError
  | UpdatingCommunityPostLike
  | UpdatingCommunityPostLikeSuccess
  | UpdatingCommunityPostLikeError
  | UpdatingCommunityPostReplyIds
  | UpdatingCommunityPostHiddenReplyIds
  | DeletingCommunityPost
  | DeletingCommunityPostSuccess
  | DeletingCommunityPostError
  | AddingCommunityDiscussionPoll
  | AddingCommunityDiscussionPollSuccess
  | AddingCommunityDiscussionPollError;
