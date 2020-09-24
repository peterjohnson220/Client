import { Action } from '@ngrx/store';

import { RateType } from 'libs/data/data-sets';

import { JobData } from '../models';

export const CARD_OPENED  = '[Comphub/Data Card] Card Opened';
export const SET_SELECTED_RATE = '[Comphub/Data Card] Set Selected Rate';
export const SET_MARKET_DATA_CHANGE = '[Comphub/Data Card] Set Market Data Change';
export const SHOW_PEER_BANNER = '[Comphub/Data Card] Show Peer Banner';
export const GET_PEER_QUICK_PRICE_DATA = '[Comphub/Data Card] Get Peer Quick Price Data';
export const GET_PEER_QUICK_PRICE_DATA_SUCCESS = '[Comphub/Data Card] Get Peer Quick Price Data Success';
export const GET_PEER_QUICK_PRICE_DATA_ERROR = '[Comphub/Data Card] Get Peer Quick Price Data Error';
export const SET_FORCE_REFRESH_PEER_MAP = '[Comphub/Data Card] Set Force Refresh Peer Map';

export class CardOpened implements Action {
  readonly type = CARD_OPENED;
}

export class SetSelectedRate implements Action {
  readonly type = SET_SELECTED_RATE;

  constructor(public payload: RateType) {}
}

export class SetMarketDataChange implements Action {
  readonly type = SET_MARKET_DATA_CHANGE;

  constructor(public payload: boolean) {}
}

export class ShowPeerBanner implements Action {
  readonly type = SHOW_PEER_BANNER;

  constructor() {}
}

export class GetPeerQuickPriceData implements Action {
  readonly type = GET_PEER_QUICK_PRICE_DATA;
}

export class GetPeerQuickPriceDataSuccess implements Action {
  readonly type = GET_PEER_QUICK_PRICE_DATA_SUCCESS;

  constructor() {}
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
  | SetSelectedRate
  | SetMarketDataChange
  | ShowPeerBanner
  | GetPeerQuickPriceData
  | GetPeerQuickPriceDataSuccess
  | GetPeerQuickPriceDataError
  | SetForceRefreshPeerMap;
