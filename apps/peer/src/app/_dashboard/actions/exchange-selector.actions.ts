import { Action } from '@ngrx/store';

import { ExchangeListItem } from 'libs/models/peer';

export const LOAD_EXCHANGES  = '[Peer Dashboard/Exchange Selector] Load Exchanges';
export const LOAD_EXCHANGES_SUCCESS  = '[Peer Dashboard/Exchange Selector] Load Exchanges Success';
export const LOAD_EXCHANGES_ERROR = '[Peer Dashboard/Exchange Selector] Load Exchanges Error';

export class LoadExchanges implements Action {
  readonly type = LOAD_EXCHANGES;
}

export class LoadExchangesSuccess implements Action {
  readonly type = LOAD_EXCHANGES_SUCCESS;

  constructor(public payload: ExchangeListItem[]) {}
}

export class LoadExchangesError implements Action {
  readonly type = LOAD_EXCHANGES_ERROR;
}

export type Actions
  = LoadExchanges
  | LoadExchangesSuccess
  | LoadExchangesError;
