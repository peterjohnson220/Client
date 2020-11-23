import { Action } from '@ngrx/store';

import { PayMarket, PayMarketCut } from 'libs/models/paymarket';

export const GET_PAY_MARKETS = '[User Settings / Pay Market Default Settings] Get Pay Markets';
export const GET_PAY_MARKETS_SUCCESS = '[User Settings / Pay Market Default Settings] Get Pay Markets Success';
export const GET_PAY_MARKETS_ERROR = '[User Settings / Pay Market Default Settings] Get Pay Markets Error';
export const GET_PAY_MARKET_CUTS = '[User Settings / Pay Market Default Settings] Get Pay Market Cuts';
export const GET_PAY_MARKET_CUTS_SUCCESS = '[User Settings / Pay Market Default Settings] Get Pay Market Cuts Success';
export const GET_PAY_MARKET_CUTS_ERROR = '[User Settings / Pay Market Default Settings] Get Pay Market Cuts Error';
export const CLEAR_PAY_MARKET_CUTS = '[User Settings / Pay Market Default Settings] Clear Pay Market Cuts';
export const SAVE_PAY_MARKET_CUTS = '[User Settings / Pay Market Default Settings] Save Pay Market Cuts';
export const SAVE_PAY_MARKET_CUTS_SUCCESS = '[User Settings / Pay Market Default Settings] Save Pay Market Cuts Success';
export const SAVE_PAY_MARKET_CUTS_ERROR = '[User Settings / Pay Market Default Settings] Save Pay Market Cuts Error';

export class GetPayMarkets implements Action {
  readonly type = GET_PAY_MARKETS;
  constructor() {}
}

export class GetPayMarketsSuccess implements Action {
  readonly type = GET_PAY_MARKETS_SUCCESS;
  constructor(public payload: PayMarket[]) {}
}

export class GetPayMarketsError implements Action {
  readonly type = GET_PAY_MARKETS_ERROR;
  constructor() {}
}

export class GetPayMarketCuts implements Action {
  readonly type = GET_PAY_MARKET_CUTS;
  constructor(public payload: { payMarketId: number }) {}
}

export class GetPayMarketCutsSuccess implements Action {
  readonly type = GET_PAY_MARKET_CUTS_SUCCESS;
  constructor(public payload: PayMarketCut[]) {}
}

export class GetPayMarketCutsError implements Action {
  readonly type = GET_PAY_MARKET_CUTS_ERROR;
  constructor() {}
}

export class ClearPayMarketCuts implements Action {
  readonly type = CLEAR_PAY_MARKET_CUTS;
  constructor() {}
}

export class SavePayMarketCuts implements Action {
  readonly type = SAVE_PAY_MARKET_CUTS;
  constructor(public payload: { payMarketId: number, dataCuts: PayMarketCut[] }) {}
}

export class SavePayMarketCutsSuccess implements Action {
  readonly type = SAVE_PAY_MARKET_CUTS_SUCCESS;
  constructor(public payload: PayMarketCut[]) {}
}

export class SavePayMarketCutsError implements Action {
  readonly type = SAVE_PAY_MARKET_CUTS_ERROR;
  constructor() {}
}

export type Actions
  = GetPayMarkets
  | GetPayMarketsSuccess
  | GetPayMarketsError
  | GetPayMarketCuts
  | GetPayMarketCutsSuccess
  | GetPayMarketCutsError
  | ClearPayMarketCuts
  | SavePayMarketCuts
  | SavePayMarketCutsSuccess
  | SavePayMarketCutsError;
