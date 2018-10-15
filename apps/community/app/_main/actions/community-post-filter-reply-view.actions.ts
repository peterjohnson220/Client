import { Action } from '@ngrx/store';

export const ADDING_COMMUNITY_POST_FILTERED_REPLIES_TO_VIEW = '[Community/Post Add Filter Replies] ' +
  'Adding Community Post Filtered Replies To View';

export const CLEARING_COMMUNITY_POST_FILTERED_REPLIES_TO_VIEW = '[Community/Post Clear Filter Replies] ' +
  'Clearing Community Post Filtered Replies To View';

export class AddingCommunityPostFilteredRepliesToView implements Action {
  readonly type = ADDING_COMMUNITY_POST_FILTERED_REPLIES_TO_VIEW;
  constructor(public payload: any) {}
}

export class ClearingCommunityPostFilteredRepliesToView implements Action {
  readonly type = CLEARING_COMMUNITY_POST_FILTERED_REPLIES_TO_VIEW;
  constructor(public payload: any) {}
}

export type Actions
  = AddingCommunityPostFilteredRepliesToView
  | ClearingCommunityPostFilteredRepliesToView;
