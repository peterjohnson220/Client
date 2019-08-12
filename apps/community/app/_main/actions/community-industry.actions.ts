import { Action } from '@ngrx/store';
import { CommunityIndustry } from 'libs/models/community/community-industry.model';

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
  constructor(public payload: CommunityIndustry[]) {}
}

export class LoadingCommunityIndustriesError implements Action {
  readonly type = LOADING_COMMUNITY_INDUSTRIES_ERROR;
}

export type Actions
  =  LoadingCommunityIndustries
  | LoadingCommunityIndustriesSuccess
  | LoadingCommunityIndustriesError;


