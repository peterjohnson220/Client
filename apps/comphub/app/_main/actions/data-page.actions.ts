import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { QuickPriceGridContext } from '../models';

export const GET_QUICK_PRICE_MARKET_DATA  = '[Comphub/Data Page] Get quick Price Data';
export const GET_QUICK_PRICE_MARKET_DATA_SUCCESS  = '[Comphub/Data Page] Get quick Price Data Success';
export const GET_QUICK_PRICE_MARKET_DATA_ERROR  = '[Comphub/Data Page] Get quick Price Data Error';

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

export type Actions
  = GetQuickPriceMarketData
  | GetQuickPriceMarketDataSuccess
  | GetQuickPriceMarketDataError;
