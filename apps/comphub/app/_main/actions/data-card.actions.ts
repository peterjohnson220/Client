import { Action } from '@ngrx/store';

import { JobData, JobGridData, QuickPriceGridContext, JobPricingLimitInfo } from '../models';
import { RateType } from '../data';

export const CARD_OPENED  = '[Comphub/Data Card] Card Opened';
export const GET_QUICK_PRICE_MARKET_DATA  = '[Comphub/Data Card] Get quick Price Data';
export const GET_QUICK_PRICE_MARKET_DATA_SUCCESS  = '[Comphub/Data Card] Get quick Price Data Success';
export const GET_QUICK_PRICE_MARKET_DATA_ERROR  = '[Comphub/Data Card] Get quick Price Data Error';
export const SET_SELECTED_JOB_DATA  = '[Comphub/Data Card] Set Selected Job Data';
export const SET_SELECTED_RATE = '[Comphub/Data Card] Set Selected Rate';
export const CLEAR_SELECTED_JOB_DATA  = '[Comphub/Data Card] Clear Selected Job Data';
export const SET_MARKET_DATA_CHANGE = '[Comphub/Data Card] Set Market Data Change';
export const SHOW_PEER_BANNER = '[Comphub/Data Card] Show Peer Banner';
export const SET_JOB_PRICING_LIMIT_INFO = '[Comphub/Data Card] Set Job Pricing Limit Info';
export const ADD_TO_PRICED_JOB_TITLE_HISTORY = '[Comphub/Data Card] Add to Priced Job Title History';
export const SHOULD_INCREMENT_PRICED_JOB_COUNT = '[Comphub/Data Card] Should Increment Priced Job Count';
export const INCREMENT_PRICED_JOB_COUNT = '[Comphub/Data Card] Increment Priced Job Count';

export class CardOpened implements Action {
  readonly type = CARD_OPENED;
}

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

export class SetSelectedJobData implements Action {
  readonly type = SET_SELECTED_JOB_DATA;

  constructor(public payload: JobData) {}
}

export class SetSelectedRate implements Action {
  readonly type = SET_SELECTED_RATE;

  constructor(public payload: RateType) {}
}

export class ClearSelectedJobData implements Action {
  readonly type = CLEAR_SELECTED_JOB_DATA;

  constructor() {}
}

export class SetMarketDataChange implements Action {
  readonly type = SET_MARKET_DATA_CHANGE;

  constructor(public payload: boolean) {}
}

export class ShowPeerBanner implements Action {
  readonly type = SHOW_PEER_BANNER;

  constructor() {}
}

export class SetJobPricingLimitInfo implements Action {
  readonly type = SET_JOB_PRICING_LIMIT_INFO;

  constructor(public payload: JobPricingLimitInfo) {}
}

export class AddToPricedJobTitleHistory implements Action {
  readonly type = ADD_TO_PRICED_JOB_TITLE_HISTORY;

  constructor(public payload: string) {}
}

export class ShouldIncrementPricedJobCount implements Action {
  readonly type = SHOULD_INCREMENT_PRICED_JOB_COUNT;

  constructor(public payload: boolean) {}
}

export class IncrementPricedJobCount  implements Action {
  readonly type = INCREMENT_PRICED_JOB_COUNT;

  constructor() {}
}


export type Actions
  = CardOpened
  | GetQuickPriceMarketData
  | GetQuickPriceMarketDataSuccess
  | GetQuickPriceMarketDataError
  | SetSelectedJobData
  | SetSelectedRate
  | ClearSelectedJobData
  | SetMarketDataChange
  | ShowPeerBanner
  | SetJobPricingLimitInfo
  | AddToPricedJobTitleHistory
  | ShouldIncrementPricedJobCount
  | IncrementPricedJobCount;
