import { Action } from '@ngrx/store';

export const LOADING_COMMUNITY_INDUSTRIES =
  '[Community/Industries] Loading Community Industries';
export const LOADING_COMMUNITY_INDUSTRIES_SUCCESS =
  '[Community/Industries] Loading Community Industries Success';
 export const LOADING_COMMUNITY_INDUSTRIES_ERROR =
  '[Community/Industries] Loading Community Industries Error';

export class LoadingCommunityIndustries implements Action {
  readonly type = LOADING_COMMUNITY_INDUSTRIES;
}

export class LoadingCommunityIndustriesSuccess implements Action {
  readonly type = LOADING_COMMUNITY_INDUSTRIES_SUCCESS;
  constructor(public payload: string[]) {}
}

export class LoadingCommunityIndustriesError implements Action {
  readonly type = LOADING_COMMUNITY_INDUSTRIES_ERROR;
}

export type Actions
  =  LoadingCommunityIndustries
  | LoadingCommunityIndustriesSuccess
  | LoadingCommunityIndustriesError;


