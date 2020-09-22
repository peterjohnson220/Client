import { Action } from '@ngrx/store';

import { JobData, JobGridData, QuickPriceGridContext } from '../models';

export const GET_QUICK_PRICE_MARKET_DATA  = '[Comphub/Jobs Card] Get quick Price Data';
export const GET_QUICK_PRICE_MARKET_DATA_SUCCESS  = '[Comphub/Jobs Card] Get quick Price Data Success';
export const GET_QUICK_PRICE_MARKET_DATA_ERROR  = '[Comphub/Jobs Card] Get quick Price Data Error';
export const LOAD_MORE_DATA_SUCCESS = '[Comphub/Jobs Card] Load More Data Success';
export const SET_SELECTED_JOB_DATA  = '[Comphub/Jobs Card] Set Selected Job Data';
export const CLEAR_SELECTED_JOB_DATA  = '[Comphub/Jobs Card] Clear Selected Job Data';
export const TOGGLE_JOB_DESCRIPTION = '[Comphub/Jobs Card] Toggle Job Description';

export class GetQuickPriceMarketData implements Action {
  readonly type = GET_QUICK_PRICE_MARKET_DATA;

  constructor(public payload: QuickPriceGridContext) {}
}

export class GetQuickPriceMarketDataSuccess implements Action {
  readonly type = GET_QUICK_PRICE_MARKET_DATA_SUCCESS;

  constructor(public payload: JobGridData) {}
}

export class GetQuickPriceMarketDataError implements Action {
  readonly type = GET_QUICK_PRICE_MARKET_DATA_ERROR;
}

export class LoadMoreDataSuccess implements Action {
  readonly type = LOAD_MORE_DATA_SUCCESS;

  constructor(public payload: JobData[]) {}
}

export class SetSelectedJobData implements Action {
  readonly type = SET_SELECTED_JOB_DATA;

  constructor(public payload: JobData) {}
}

export class ClearSelectedJobData implements Action {
  readonly type = CLEAR_SELECTED_JOB_DATA;

  constructor() {}
}

export class ToggleJobDescription implements Action {
  readonly type = TOGGLE_JOB_DESCRIPTION;

  constructor(public payload: { jobId: number }) {}
}

export type Actions
  = GetQuickPriceMarketData
  | GetQuickPriceMarketDataSuccess
  | GetQuickPriceMarketDataError
  | LoadMoreDataSuccess
  | SetSelectedJobData
  | ClearSelectedJobData
  | ToggleJobDescription;

