import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { JobData, QuickPriceGridContext } from '../models';

export const GET_QUICK_PRICE_MARKET_DATA  = '[Comphub/Data Card] Get quick Price Data';
export const GET_QUICK_PRICE_MARKET_DATA_SUCCESS  = '[Comphub/Data Card] Get quick Price Data Success';
export const GET_QUICK_PRICE_MARKET_DATA_ERROR  = '[Comphub/Data Card] Get quick Price Data Error';
export const SET_SELECTED_JOB_DATA  = '[Comphub/Data Card] Set Selected Job Data';

export class GetQuickPriceMarketData implements Action {
  readonly type = GET_QUICK_PRICE_MARKET_DATA;

  constructor(public payload: QuickPriceGridContext) {}
}

export class GetQuickPriceMarketDataSuccess implements Action {
  readonly type = GET_QUICK_PRICE_MARKET_DATA_SUCCESS;

  constructor(public payload: GridDataResult) {}
}

export class GetQuickPriceMarketDataError implements Action {
  readonly type = GET_QUICK_PRICE_MARKET_DATA_ERROR;
}

export class SetSelectedJobData implements Action {
  readonly type = SET_SELECTED_JOB_DATA;

  constructor(public payload: JobData) {}
}

export type Actions
  = GetQuickPriceMarketData
  | GetQuickPriceMarketDataSuccess
  | GetQuickPriceMarketDataError
  | SetSelectedJobData;
