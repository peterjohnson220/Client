import { Action } from '@ngrx/store';
import { CommunityCompanySize } from 'libs/models/community/community-company-size.model';

export const LOADING_COMMUNITY_COMPANY_SIZES =
  '[Community/Company Sizes] Loading Community Company Sizes';
export const LOADING_COMMUNITY_COMPANY_SIZES_SUCCESS =
  '[Community/Company Sizes] Loading Community Company Sizes Success';
 export const LOADING_COMMUNITY_COMPANY_SIZES_ERROR =
  '[Community/Company Sizes] Loading Community Company Sizes Error';

export class LoadingCommunityCompanySizes implements Action {
  readonly type = LOADING_COMMUNITY_COMPANY_SIZES;
}

export class LoadingCommunityCompanySizesSuccess implements Action {
  readonly type = LOADING_COMMUNITY_COMPANY_SIZES_SUCCESS;
  constructor(public payload: CommunityCompanySize[]) {}
}

export class LoadingCommunityCompanySizesError implements Action {
  readonly type = LOADING_COMMUNITY_COMPANY_SIZES_ERROR;
}

export type Actions
  =  LoadingCommunityCompanySizes
  | LoadingCommunityCompanySizesSuccess
  | LoadingCommunityCompanySizesError;


