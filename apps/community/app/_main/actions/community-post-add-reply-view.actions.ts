import { Action } from '@ngrx/store';

export const ADDING_COMMUNITY_POST_REPLY_TO_VIEW = '[Community/Post Add Reply] Adding Community Post Add Reply To View';
export const CLEARING_COMMUNITY_POST_REPLIES = '[Community/Post Add Reply] Clearing Community Post Replies';


export class AddingCommunityPostReplyToView implements Action {
  readonly type = ADDING_COMMUNITY_POST_REPLY_TO_VIEW;
  constructor(public payload: any) {}
}

export class ClearingCommunityPostReplies implements Action {
  readonly type = CLEARING_COMMUNITY_POST_REPLIES;
  constructor(public payload: any) {}
}
export type Actions
  = AddingCommunityPostReplyToView
  | ClearingCommunityPostReplies;
