import { Action } from '@ngrx/store';

export const GETTING_COMMUNITY_POST_REPLIES = '[Community/Post Replies] Get Community Post Replies';
export const GETTING_COMMUNITY_POST_REPLIES_SUCCESS = '[Community/Post Replies] Get Community Post Replies Success';
export const GETTING_COMMUNITY_POST_REPLIES_ERROR = '[Community/Post Replies] Get Community Post Replies Error';

export const UPDATING_COMMUNITY_POST_REPLY_LIKE = '[Community/Post Replies] Updating Community Post Reply Like';
export const UPDATING_COMMUNITY_POST_REPLY_LIKE_SUCCESS = '[Community/Post Replies] Updating Community Post Reply Like Success';
export const UPDATING_COMMUNITY_POST_REPLY_LIKE_ERROR = '[Community/Post Replies] Updating Community Post Reply Like Error';

export const ADDING_COMMUNITY_POST_REPLY = '[Community/Post Add Reply] Adding Community Post Add Reply';
export const ADDING_COMMUNITY_POST_REPLY_SUCCESS = '[Community/Post Add Reply] Adding Community Post Add ReplySuccess';
export const ADDING_COMMUNITY_POST_REPLY_ERROR = '[Community/Post Add Reply] Adding Community Post Add Reply Error';
export const CLEARING_COMMUNITY_POST_REPLIES = '[Community/Post Add Reply] Clearing Community Post Replies';

export const DELETING_COMMUNITY_POST_REPLY = '[Community/Post Replies] Deleting Community Post Reply';
export const DELETING_COMMUNITY_POST_REPLY_SUCCESS = '[Community/Post Replies] Deleting Community Post Reply Success';
export const DELETING_COMMUNITY_POST_REPLY_ERROR = '[Community/Post Replies] Deleting Community Post Reply Delete';

export const EDITING_COMMUNITY_POST_REPLY = '[Community/Post Replies] Editing Community Post Reply';
export const EDITING_COMMUNITY_POST_REPLY_SUCCESS = '[Community/Post Replies] Editing Community Post Reply Success';
export const EDITING_COMMUNITY_POST_REPLY_ERROR = '[Community/Post Replies] Editing Community Post Reply Error';

export const CANCEL_EDITING_COMMUNITY_POST_REPLY = '[Community/Post Replies] Cancel Editing Community Post Reply';
export const CANCEL_EDITING_COMMUNITY_POST_REPLY_SUCCESS = '[Community/Post Replies] Cancel Editing Community Post Reply Success';
export const CANCEL_EDITING_COMMUNITY_POST_REPLY_ERROR = '[Community/Post Replies] Cancel Editing Community Post Reply Error';

export const SAVING_COMMUNITY_POST_REPLY_EDIT = '[Community/Post Replies] Saving Community Post Reply Edit';
export const SAVING_COMMUNITY_POST_REPLY_EDIT_SUCCESS = '[Community/Post Replies] Saving Community Post Reply Edit Success';
export const SAVING_COMMUNITY_POST_REPLY_EDIT_ERROR = '[Community/Post Replies] Saving Community Post Reply Edit Error';

export const DISCARDING_COMMUNITY_POST_REPLY = '[Community/Post Replies] Discarding Community Post Reply';
export const DISCARDING_COMMUNITY_POST_REPLY_PROCEED = '[Community/Post Replies] Discarding Community Post Reply Proceed';
export const DISCARDING_COMMUNITY_POST_REPLY_CANCEL = '[Community/Post Replies] Canceling Community Post Reply Cancel';

export class GettingCommunityPostReplies implements Action {
  readonly type = GETTING_COMMUNITY_POST_REPLIES;
  constructor(public payload: any) {}
}

export class GettingCommunityPostRepliesSuccess implements Action {
  readonly type = GETTING_COMMUNITY_POST_REPLIES_SUCCESS;
  constructor(public payload: any) {}
}

export class GettingCommunityPostRepliesError implements Action {
  readonly type = GETTING_COMMUNITY_POST_REPLIES_ERROR;
}

export class UpdatingCommunityPostReplyLike implements Action {
  readonly type = UPDATING_COMMUNITY_POST_REPLY_LIKE;
  constructor(public payload: any) {}
}

export class UpdatingCommunityPostReplyLikeSuccess implements Action {
  readonly type = UPDATING_COMMUNITY_POST_REPLY_LIKE_SUCCESS;
  constructor(public payload: any) {}
}

export class UpdatingCommunityPostReplyLikeError implements Action {
  readonly type = UPDATING_COMMUNITY_POST_REPLY_LIKE_ERROR;
}

export class AddingCommunityPostReply implements Action {
  readonly type = ADDING_COMMUNITY_POST_REPLY;
  constructor(public payload: any) {}
}

export class AddingCommunityPostReplySuccess implements Action {
  readonly type = ADDING_COMMUNITY_POST_REPLY_SUCCESS;
  constructor(public payload: any) {}
}

export class AddingCommunityPostReplyError implements Action {
  readonly type = ADDING_COMMUNITY_POST_REPLY_ERROR;
}

export class ClearingCommunityPostReplies implements Action {
  readonly type = CLEARING_COMMUNITY_POST_REPLIES;
  constructor(public payload: any) {}
}

export class DeletingCommunityPostReply implements Action {
  readonly type = DELETING_COMMUNITY_POST_REPLY;
  constructor(public payload: any) {}
}

export class DeletingCommunityPostReplySuccess implements Action {
  readonly type = DELETING_COMMUNITY_POST_REPLY_SUCCESS;
  constructor(public payload: any) {}
}

export class DeletingCommunityPostReplyError implements Action {
  readonly type = DELETING_COMMUNITY_POST_REPLY_ERROR;
}

export class EditingCommunityPostReply implements Action {
  constructor(public payload: any) {}
  readonly type = EDITING_COMMUNITY_POST_REPLY;
}

export class EditingCommunityPostReplySuccess implements Action {
  readonly type = EDITING_COMMUNITY_POST_REPLY_SUCCESS;
}

export class EditingCommunityPostReplyError implements Action {
  readonly type = EDITING_COMMUNITY_POST_REPLY_ERROR;
}

export class CancelEditingCommunityPostReply implements Action {
  readonly type = CANCEL_EDITING_COMMUNITY_POST_REPLY;
}

export class CancelEditingCommunityPostReplySuccess implements Action {
  readonly type = CANCEL_EDITING_COMMUNITY_POST_REPLY_SUCCESS;
}

export class CancelEditingCommunityPostReplyError implements Action {
  readonly type = CANCEL_EDITING_COMMUNITY_POST_REPLY_ERROR;
}

export class SavingCommunityPostReplyEdit implements Action {
  constructor(public payload: any) {}
  readonly type = SAVING_COMMUNITY_POST_REPLY_EDIT;
}

export class SavingCommunityPostReplyEditSuccess implements Action {
  constructor(public payload: any) {}
  readonly type = SAVING_COMMUNITY_POST_REPLY_EDIT_SUCCESS;
}

export class SavingCommunityPostReplyEditError implements Action {
  readonly type = SAVING_COMMUNITY_POST_REPLY_EDIT_ERROR;
}

export class DiscardingCommunityPostReply implements Action {
  readonly type = DISCARDING_COMMUNITY_POST_REPLY;
  constructor(public postId: string, public showWarning: boolean) {}
}

export class DiscardingCommunityPostReplyProceed implements Action {
  readonly type = DISCARDING_COMMUNITY_POST_REPLY_PROCEED;
}

export class DiscardingCommunityPostReplyCancel implements Action {
  readonly type = DISCARDING_COMMUNITY_POST_REPLY_CANCEL;
}

export type Actions
  = GettingCommunityPostReplies
  | GettingCommunityPostRepliesSuccess
  | GettingCommunityPostRepliesError
  | UpdatingCommunityPostReplyLike
  | UpdatingCommunityPostReplyLikeSuccess
  | UpdatingCommunityPostReplyLikeError
  | AddingCommunityPostReply
  | AddingCommunityPostReplySuccess
  | AddingCommunityPostReplyError
  | ClearingCommunityPostReplies
  | DeletingCommunityPostReply
  | DeletingCommunityPostReplySuccess
  | DeletingCommunityPostReplyError
  | EditingCommunityPostReply
  | EditingCommunityPostReplySuccess
  | EditingCommunityPostReplyError
  | CancelEditingCommunityPostReply
  | CancelEditingCommunityPostReplySuccess
  | CancelEditingCommunityPostReplyError
  | SavingCommunityPostReplyEdit
  | SavingCommunityPostReplyEditSuccess
  | SavingCommunityPostReplyEditError
  | DiscardingCommunityPostReply
  | DiscardingCommunityPostReplyProceed
  | DiscardingCommunityPostReplyCancel;
