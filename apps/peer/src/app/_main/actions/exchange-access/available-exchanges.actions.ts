import { Action } from '@ngrx/store';

import { AvailableExchangeItem } from 'libs/models/peer/index';

export const LOAD_AVAILABLE_EXCHANGES  = '[Peer Main/Available Exchanges] Load Available Exchanges';
export const LOAD_AVAILABLE_EXCHANGES_SUCCESS  = '[Peer Main/Available Exchanges] Load Available Exchanges Success';
export const LOAD_AVAILABLE_EXCHANGES_ERROR = '[Peer Main/Available Exchanges] Load Available Exchanges Error';
export const SELECT_AVAILABLE_EXCHANGE = '[Peer Main/Available Exchanges] Select an Available Exchange';

export class LoadAvailableExchanges implements Action {
  readonly type = LOAD_AVAILABLE_EXCHANGES;
  readonly payload = null;
}

export class LoadAvailableExchangesSuccess implements Action {
  readonly type = LOAD_AVAILABLE_EXCHANGES_SUCCESS;

  constructor(public payload: AvailableExchangeItem[]) {}
}

export class LoadAvailableExchangesError implements Action {
  readonly type = LOAD_AVAILABLE_EXCHANGES_ERROR;
}

export class SelectAvailableExchange implements Action {
  readonly type = SELECT_AVAILABLE_EXCHANGE;

  constructor(public payload: AvailableExchangeItem) {}
}

export type Actions
  = LoadAvailableExchanges
  | LoadAvailableExchangesSuccess
  | LoadAvailableExchangesError
  | SelectAvailableExchange;
