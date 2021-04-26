import { Action } from '@ngrx/store';

export const GET_PEER_TRENDS = '[Comphub/Trends Summary Card] Get Peer Trends';
export const GET_PEER_TRENDS_SUCCESS = '[Comphub/Trends Summary Card] Get Peer Trends Success';
export const GET_PEER_TRENDS_ERROR = '[Comphub/Trends Summary Card] Get Peer Trends Error';

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

export type Actions =
  GetPeerTrends |
  GetPeerTrendsSuccess |
  GetPeerTrendsError;
