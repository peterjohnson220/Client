import { Action } from '@ngrx/store';
import { CommunitySearchResult } from 'libs/models/community';

export const SEARCHING_COMMUNITY = '[Community/Search] Searching Community';
export const SEARCHING_COMMUNITY_SUCCESS = '[Community/Search] Searching Community Success';
export const SEARCHING_COMMUNITY_ERROR = '[Community/Search] Searching Community Error';

export class SearchingCommunity implements Action {
  readonly type = SEARCHING_COMMUNITY;
  constructor(public payload: string) {}
}

export class SearchingCommunitySuccess implements Action {
  readonly type = SEARCHING_COMMUNITY_SUCCESS;
  constructor(public payload: CommunitySearchResult[]) {}
}

export class SearchingCommunityError implements Action {
  readonly type = SEARCHING_COMMUNITY_ERROR;
}

export type Actions
  = SearchingCommunity
  | SearchingCommunitySuccess
  | SearchingCommunityError;
