import { Action } from '@ngrx/store';
import { CommunityPollUpsertRequest } from 'libs/models/community/community-poll-upsert-request.model';

export const SUBMITTING_COMMUNITY_POST = '[Community/Post] Submitting Community Post';
export const SUBMITTING_COMMUNITY_POST_SUCCESS = '[Community/Post] Submitting Community Post Success';
export const SUBMITTING_COMMUNITY_POST_ERROR = '[Community/Post] Submitting Community Post Error';

export const GETTING_COMMUNITY_POSTS = '[Community/Post] Get Community Posts';
export const GETTING_COMMUNITY_POSTS_SUCCESS = '[Community/Post] Get Community Posts Success';
export const GETTING_COMMUNITY_POSTS_ERROR = '[Community/Post] Get Community Posts Error';

export const GETTING_NEXT_BATCH_COMMUNITY_POSTS = '[Community/Post] Get Next Batch Community Posts';
export const GETTING_NEXT_BATCH_COMMUNITY_POSTS_SUCCESS = '[Community/Post] Get Next Batch Community Posts Success';
export const GETTING_NEXT_BATCH_COMMUNITY_POSTS_ERROR = '[Community/Post] Get Next Batch Community Posts Error';

export const GETTING_PREVIOUS_BATCH_COMMUNITY_POSTS = '[Community/Post] Get Previous Batch Community Posts';
export const GETTING_PREVIOUS_BATCH_COMMUNITY_POSTS_SUCCESS = '[Community/Post] Get Previous Batch Community Posts Success';
export const GETTING_PREVIOUS_BATCH_COMMUNITY_POSTS_ERROR = '[Community/Post] Get Previous Batch Community Posts Error';

export const GETTING_BACK_TO_TOP_COMMUNITY_POSTS = '[Community/Post] Get Back To Top Community Posts';
export const GETTING_BACK_TO_TOP_COMMUNITY_POSTS_SUCCESS = '[Community/Post] Get Back To Top Community Posts Success';
export const GETTING_BACK_TO_TOP_COMMUNITY_POSTS_ERROR = '[Community/Post] Get Back To Top Community Posts Error';

export const UPDATING_COMMUNITY_POST_LIKE = '[Community/Post] Updating Community Post Like';
export const UPDATING_COMMUNITY_POST_LIKE_SUCCESS = '[Community/Post] Updating Community Post Like Success';
export const UPDATING_COMMUNITY_POST_LIKE_ERROR = '[Community/Post] Updating Community Post Like Error';

export const UPDATING_COMMUNITY_POST_FAVORITE = '[Community/Post] Updating Community Post Favorite';
export const UPDATING_COMMUNITY_POST_FAVORITE_SUCCESS = '[Community/Post] Updating Community Post Favorite Success';
export const UPDATING_COMMUNITY_POST_FAVORITE_ERROR = '[Community/Post] Updating Community Post Favorite Error';

export const UPDATING_COMMUNITY_POST_REPLY_IDS = '[Community/Post] Updating Community Post Reply Ids';
export const UPDATING_COMMUNITY_POST_HIDDEN_REPLY_IDS = '[Community/Post] Updating Community Post Hidden Reply Ids';

export const DELETING_COMMUNITY_POST = '[Community/Post] Deleting Community Post';
export const DELETING_COMMUNITY_POST_SUCCESS = '[Community/Post] Deleting Community Post Success';
export const DELETING_COMMUNITY_POST_ERROR = '[Community/Post] Deleting Community Post Error';

export const ADDING_COMMUNITY_DISCUSSION_POLL = '[Community/Post] Adding Community Discussion Poll';
export const ADDING_COMMUNITY_DISCUSSION_POLL_SUCCESS = '[Community/Post] Adding Community Discussion Poll Success';
export const ADDING_COMMUNITY_DISCUSSION_POLL_ERROR = '[Community/Post] Adding Community Discussion Poll Error';

export const GETTING_COMMUNITY_POST = '[Community/Post] Get Community Post';
export const GETTING_COMMUNITY_POST_SUCCESS = '[Community/Post] Get Community Post Success';
export const GETTING_COMMUNITY_POST_ERROR = '[Community/Post] Get Community Post Error';

export const EDITING_COMMUNITY_POST = '[Community/Post] Editing Community Post';
export const EDITING_COMMUNITY_POST_SUCCESS = '[Community/Post] Editing Community Post Success';
export const EDITING_COMMUNITY_POST_ERROR = '[Community/Post] Editing Community Post Error';

export const CANCEL_EDITING_COMMUNITY_POST = '[Community/Post] Cancel Editing Community Post';
export const CANCEL_EDITING_COMMUNITY_POST_SUCCESS = '[Community/Post] Cancel Editing Community Post Success';
export const CANCEL_EDITING_COMMUNITY_POST_ERROR = '[Community/Post] Cancel Editing Community Post Error';

export const SAVING_COMMUNITY_POST_EDIT = '[Community/Post] Saving Community Post Edit';
export const SAVING_COMMUNITY_POST_EDIT_SUCCESS = '[Community/Post] Saving Community Post Edit Success';
export const SAVING_COMMUNITY_POST_EDIT_ERROR = '[Community/Post] Saving Community Post Edit Error';

export const DISCARDING_COMMUNITY_POST = '[Community/Post] Discarding Community Post';
export const DISCARDING_COMMUNITY_POST_PROCEED = '[Community/Post] Discarding Community Post Proceed';
export const DISCARDING_COMMUNITY_POST_CANCEL = '[Community/Post] Canceling Community Post Cancel';


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

export class GettingNextBatchCommunityPosts implements Action {
  readonly type = GETTING_NEXT_BATCH_COMMUNITY_POSTS;
}

export class GettingNextBatchCommunityPostsSuccess implements Action {
  readonly type = GETTING_NEXT_BATCH_COMMUNITY_POSTS_SUCCESS;
  constructor(public payload: any) {}
}

export class GettingNextBatchCommunityPostsError implements Action {
  readonly type = GETTING_NEXT_BATCH_COMMUNITY_POSTS_ERROR;
}

export class GettingPreviousBatchCommunityPosts implements Action {
  readonly type = GETTING_PREVIOUS_BATCH_COMMUNITY_POSTS;
}

export class GettingPreviousBatchCommunityPostsSuccess implements Action {
  readonly type = GETTING_PREVIOUS_BATCH_COMMUNITY_POSTS_SUCCESS;
  constructor(public payload: any) {}
}

export class GettingPreviousBatchCommunityPostsError implements Action {
  readonly type = GETTING_PREVIOUS_BATCH_COMMUNITY_POSTS_ERROR;
}

export class GettingBackToTopCommunityPosts implements Action {
  readonly type = GETTING_BACK_TO_TOP_COMMUNITY_POSTS;
}

export class GettingBackToTopCommunityPostsSuccess implements Action {
  readonly type = GETTING_BACK_TO_TOP_COMMUNITY_POSTS_SUCCESS;
  constructor(public payload: any) {}
}

export class GettingBackToTopCommunityPostsError implements Action {
  readonly type = GETTING_BACK_TO_TOP_COMMUNITY_POSTS_ERROR;
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

export class UpdatingCommunityPostFavorite implements Action {
  readonly type = UPDATING_COMMUNITY_POST_FAVORITE;
  constructor(public payload: any) {}
}

export class UpdatingCommunityPostFavoriteSuccess implements Action {
  readonly type = UPDATING_COMMUNITY_POST_FAVORITE_SUCCESS;
  constructor(public payload: any) {}
}

export class UpdatingCommunityPostFavoriteError implements Action {
  readonly type = UPDATING_COMMUNITY_POST_FAVORITE_ERROR;
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

export class GettingCommunityPost implements Action {
  readonly type = GETTING_COMMUNITY_POST;
  constructor(public payload: any) {}
}

export class GettingCommunityPostSuccess implements Action {
  readonly type = GETTING_COMMUNITY_POST_SUCCESS;
  constructor(public payload: any) {}
}

export class GettingCommunityPostError implements Action {
  readonly type = GETTING_COMMUNITY_POST_ERROR;
}

export class EditingCommunityPost implements Action {
  constructor(public payload: any) {}
  readonly type = EDITING_COMMUNITY_POST;
}

export class EditingCommunityPostSuccess implements Action {
  readonly type = EDITING_COMMUNITY_POST_SUCCESS;
}

export class EditingCommunityPostError implements Action {
  readonly type = EDITING_COMMUNITY_POST_ERROR;
}

export class CancelEditingCommunityPost implements Action {
  readonly type = CANCEL_EDITING_COMMUNITY_POST;
}

export class CancelEditingCommunityPostSuccess implements Action {
  readonly type = CANCEL_EDITING_COMMUNITY_POST_SUCCESS;
}

export class CancelEditingCommunityPostError implements Action {
  readonly type = CANCEL_EDITING_COMMUNITY_POST_ERROR;
}

export class SavingCommunityPostEdit implements Action {
  constructor(public payload: any) {}
  readonly type = SAVING_COMMUNITY_POST_EDIT;
}

export class SavingCommunityPostEditSuccess implements Action {
  constructor(public payload: any) {}
  readonly type = SAVING_COMMUNITY_POST_EDIT_SUCCESS;
}

export class SavingCommunityPostEditError implements Action {
  readonly type = SAVING_COMMUNITY_POST_EDIT_ERROR;
}

export class DiscardingCommunityPost implements Action {
  readonly type = DISCARDING_COMMUNITY_POST;
}

export class DiscardingCommunityPostProceed implements Action {
  readonly type = DISCARDING_COMMUNITY_POST_PROCEED;
}

export class DiscardingCommunityPostCancel implements Action {
  readonly type = DISCARDING_COMMUNITY_POST_CANCEL;
}

export type Actions
  =  SubmittingCommunityPost
  | SubmittingCommunityPostSuccess
  | SubmittingCommunityPostError
  | GettingCommunityPosts
  | GettingCommunityPostsSuccess
  | GettingCommunityPostsError
  | GettingNextBatchCommunityPosts
  | GettingNextBatchCommunityPostsSuccess
  | GettingNextBatchCommunityPostsError
  | GettingPreviousBatchCommunityPosts
  | GettingPreviousBatchCommunityPostsSuccess
  | GettingPreviousBatchCommunityPostsError
  | GettingBackToTopCommunityPosts
  | GettingBackToTopCommunityPostsSuccess
  | GettingBackToTopCommunityPostsError
  | UpdatingCommunityPostLike
  | UpdatingCommunityPostLikeSuccess
  | UpdatingCommunityPostLikeError
  | UpdatingCommunityPostFavorite
  | UpdatingCommunityPostFavoriteSuccess
  | UpdatingCommunityPostFavoriteError
  | UpdatingCommunityPostReplyIds
  | UpdatingCommunityPostHiddenReplyIds
  | DeletingCommunityPost
  | DeletingCommunityPostSuccess
  | DeletingCommunityPostError
  | AddingCommunityDiscussionPoll
  | AddingCommunityDiscussionPollSuccess
  | AddingCommunityDiscussionPollError
  | GettingCommunityPost
  | GettingCommunityPostSuccess
  | GettingCommunityPostError
  | EditingCommunityPost
  | EditingCommunityPostSuccess
  | EditingCommunityPostError
  | CancelEditingCommunityPost
  | CancelEditingCommunityPostSuccess
  | CancelEditingCommunityPostError
  | SavingCommunityPostEdit
  | SavingCommunityPostEditSuccess
  | SavingCommunityPostEditError
  | DiscardingCommunityPost
  | DiscardingCommunityPostProceed
  | DiscardingCommunityPostCancel;
