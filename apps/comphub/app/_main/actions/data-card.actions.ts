import { Action } from '@ngrx/store';

import { RateType } from 'libs/data/data-sets';

import { JobData, JobGridData, QuickPriceGridContext } from '../models';

export const CARD_OPENED  = '[Comphub/Data Card] Card Opened';
export const GET_QUICK_PRICE_MARKET_DATA  = '[Comphub/Data Card] Get quick Price Data';
export const GET_QUICK_PRICE_MARKET_DATA_SUCCESS  = '[Comphub/Data Card] Get quick Price Data Success';
export const GET_QUICK_PRICE_MARKET_DATA_ERROR  = '[Comphub/Data Card] Get quick Price Data Error';
export const SET_SELECTED_JOB_DATA  = '[Comphub/Data Card] Set Selected Job Data';
export const SET_SELECTED_RATE = '[Comphub/Data Card] Set Selected Rate';
export const CLEAR_SELECTED_JOB_DATA  = '[Comphub/Data Card] Clear Selected Job Data';
export const SET_MARKET_DATA_CHANGE = '[Comphub/Data Card] Set Market Data Change';
export const SHOW_PEER_BANNER = '[Comphub/Data Card] Show Peer Banner';
export const TOGGLE_JOB_DESCRIPTION = '[Comphub/Data Card] Toggle Job Description';
export const GET_PEER_QUICK_PRICE_DATA = '[Comphub/Data Card] Get Peer Quick Price Data';
export const GET_PEER_QUICK_PRICE_DATA_SUCCESS = '[Comphub/Data Card] Get Peer Quick Price Data Success';
export const GET_PEER_QUICK_PRICE_DATA_ERROR = '[Comphub/Data Card] Get Peer Quick Price Data Error';
export const SET_FORCE_REFRESH_PEER_MAP = '[Comphub/Data Card] Set Force Refresh Peer Map';

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

export class ToggleJobDescription implements Action {
  readonly type = TOGGLE_JOB_DESCRIPTION;

  constructor(public payload: { jobId: number }) {}
}

export class GetPeerQuickPriceData implements Action {
  readonly type = GET_PEER_QUICK_PRICE_DATA;
}

export class GetPeerQuickPriceDataSuccess implements Action {
  readonly type = GET_PEER_QUICK_PRICE_DATA_SUCCESS;

  constructor(public payload: {jobData: JobData}) {}
}

export class GetPeerQuickPriceDataError implements Action {
  readonly type = GET_PEER_QUICK_PRICE_DATA_ERROR;
}

export class SetForceRefreshPeerMap implements Action {
  readonly type = SET_FORCE_REFRESH_PEER_MAP;

  constructor(public payload: boolean) {}
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
  | ToggleJobDescription
  | GetPeerQuickPriceData
  | GetPeerQuickPriceDataSuccess
  | GetPeerQuickPriceDataError
  | SetForceRefreshPeerMap;
