import { Action } from '@ngrx/store';

import { TrendsSummaryDetails } from '../models/trends-summary-details.model';

export const GET_PEER_TRENDS = '[Comphub/Trends Summary Card] Get Peer Trends';
export const GET_PEER_TRENDS_SUCCESS = '[Comphub/Trends Summary Card] Get Peer Trends Success';
export const GET_PEER_TRENDS_ERROR = '[Comphub/Trends Summary Card] Get Peer Trends Error';
export const SET_TRENDS_DOMAIN = '[Comphub/Trends Summary Card] Set Trends Domain';
export const SET_TRENDS_PERCENT_CHANGE = '[Comphub/Trends Summary Card] Set Trends Percent Change';

export class
GetPeerTrends implements Action {
  readonly type = GET_PEER_TRENDS;
}

export class GetPeerTrendsSuccess implements Action {
  readonly type = GET_PEER_TRENDS_SUCCESS;

  constructor(public payload: any[]) {}
}

export class GetPeerTrendsError implements Action {
  readonly type = GET_PEER_TRENDS_ERROR;
}

export class SetTrendsDomain implements Action {
  readonly type = SET_TRENDS_DOMAIN;

  constructor(public payload: {minDate: Date, maxDate: Date}) {}
}

export class SetTrendsPercentChange implements Action {
  readonly type = SET_TRENDS_PERCENT_CHANGE;

  constructor(public payload: TrendsSummaryDetails) {}
}

export type Actions =
  GetPeerTrends |
  GetPeerTrendsSuccess |
  GetPeerTrendsError |
  SetTrendsDomain |
  SetTrendsPercentChange;
