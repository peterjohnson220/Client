import { Action } from '@ngrx/store';
import { CommunitySearchResult } from 'libs/models/community';

export const SEARCHING_COMMUNITY = '[Community/Search] Searching Community';
export const SEARCHING_COMMUNITY_SUCCESS = '[Community/Search] Searching Community Success';
export const SEARCHING_COMMUNITY_ERROR = '[Community/Search] Searching Community Error';

export const OPEN_SEARCH_RESULT_MODAL = '[Community/Search] Open Search Result Modal';
export const CLOSE_SEARCH_RESULT_MODAL = '[Community/Search] Close Search Result Modal';

export const GETTING_MORE_COMMUNITY_SEARCH_RESULTS = '[Community/Search] Getting More Community Search Results';
export const GETTING_MORE_COMMUNITY_SEARCH_RESULTS_SUCCESS = '[Community/Search] Getting More Community Search Results Success';
export const GETTING_MORE_COMMUNITY_SEARCH_RESULTS_ERROR = '[Community/Search] Getting More Community Search Results Error';


export class SearchingCommunity implements Action {
  readonly type = SEARCHING_COMMUNITY;
  constructor(public searchTerm: string, public searchDuration: number) {}
}

export class SearchingCommunitySuccess implements Action {
  readonly type = SEARCHING_COMMUNITY_SUCCESS;
  constructor(public payload: any) {}
}

export class SearchingCommunityError implements Action {
  readonly type = SEARCHING_COMMUNITY_ERROR;
}

export class OpenSearchResultModal implements Action {
  readonly type = OPEN_SEARCH_RESULT_MODAL;
  constructor(public payload: any) {}
}
export class CloseSearchResultModal implements Action {
  readonly type = CLOSE_SEARCH_RESULT_MODAL;
}

export class GettingMoreCommunitySearchResults implements Action {
  readonly type = GETTING_MORE_COMMUNITY_SEARCH_RESULTS;
  constructor(public payload: any) {}
}

export class GettingMoreCommunitySearchResultsSuccess implements Action {
  readonly type = GETTING_MORE_COMMUNITY_SEARCH_RESULTS_SUCCESS;
  constructor(public payload: any) {}
}

export class GettingMoreCommunitySearchResultsError implements Action {
  readonly type = GETTING_MORE_COMMUNITY_SEARCH_RESULTS_ERROR;
}

export type Actions
  = SearchingCommunity
  | SearchingCommunitySuccess
  | SearchingCommunityError
  | OpenSearchResultModal
  | CloseSearchResultModal
  | GettingMoreCommunitySearchResults
  | GettingMoreCommunitySearchResultsSuccess
  | GettingMoreCommunitySearchResultsError;
