import { Action } from '@ngrx/store';

import { PricingMatchesDetailsRequest } from 'libs/models/payfactors-api';

export const GET_MATCHES_DETAILS = '[Project Add Data/Search Results] Get Matches Details';
export const GET_MATCHES_DETAILS_SUCCESS = '[Project Add Data/Search Results] Get Matches Details Success';
export const OPEN_MATCHES_DETAILS_TOOLTIP = '[Project Add Data/Search Results] Open Matches Details Tooltip';
export const CLOSE_MATCHES_DETAILS_TOOLTIP = '[Project Add Data/Search Results] Close Matches Details Tooltip';

export class GetMatchesDetails implements Action {
  readonly type = GET_MATCHES_DETAILS;

  constructor(public payload: PricingMatchesDetailsRequest) {}
}

export class GetMatchesDetailsSuccess implements Action {
  readonly type = GET_MATCHES_DETAILS_SUCCESS;

  constructor(public payload: string[]) {}
}

export class OpenMatchesDetailsTooltip implements Action {
  readonly type = OPEN_MATCHES_DETAILS_TOOLTIP;
}

export class CloseMatchesDetailsTooltip implements Action {
  readonly type = CLOSE_MATCHES_DETAILS_TOOLTIP;
}

export type Actions
  = GetMatchesDetails
  | GetMatchesDetailsSuccess
  | OpenMatchesDetailsTooltip
  | CloseMatchesDetailsTooltip;
