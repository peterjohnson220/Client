import { Action } from '@ngrx/store';

import { JobData, JobGridData, QuickPriceGridContext } from '../models';

export const GET_QUICK_PRICE_MARKET_DATA  = '[Comphub/Jobs Card] Get quick Price Data';
export const GET_QUICK_PRICE_DATA_SUCCESS  = '[Comphub/Jobs Card] Get quick Price Data Success';
export const GET_QUICK_PRICE_MARKET_DATA_ERROR  = '[Comphub/Jobs Card] Get quick Price Data Error';
export const LOAD_MORE_DATA_SUCCESS = '[Comphub/Jobs Card] Load More Data Success';
export const TOGGLE_JOB_DESCRIPTION = '[Comphub/Jobs Card] Toggle Job Description';
export const GET_PEER_JOB_DATA = '[Comphub/Jobs Card] Get Peer Job Data';

export class GetQuickPriceMarketData implements Action {
  readonly type = GET_QUICK_PRICE_MARKET_DATA;

  constructor(public payload: QuickPriceGridContext) {}
}

export class GetQuickPriceDataSuccess implements Action {
  readonly type = GET_QUICK_PRICE_DATA_SUCCESS;

  constructor(public payload: JobGridData) {}
}

export class GetQuickPriceMarketDataError implements Action {
  readonly type = GET_QUICK_PRICE_MARKET_DATA_ERROR;
}

export class LoadMoreDataSuccess implements Action {
  readonly type = LOAD_MORE_DATA_SUCCESS;

  constructor(public payload: JobData[]) {}
}

export class ToggleJobDescription implements Action {
  readonly type = TOGGLE_JOB_DESCRIPTION;

  constructor(public payload: { jobId: number }) {}
}

export class GetPeerJobData implements Action {
  readonly type = GET_PEER_JOB_DATA;
}

export type Actions
  = GetQuickPriceMarketData
  | GetQuickPriceDataSuccess
  | GetQuickPriceMarketDataError
  | LoadMoreDataSuccess
  | ToggleJobDescription
  | GetPeerJobData;
