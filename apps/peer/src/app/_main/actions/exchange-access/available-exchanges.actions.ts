import { Action } from '@ngrx/store';

import { AvailableExchangeItem } from 'libs/models/peer/index';

export const LOAD_AVAILABLE_EXCHANGES  = '[Peer Main/Available Exchanges] Load Available Exchanges';
export const LOAD_AVAILABLE_EXCHANGES_SUCCESS  = '[Peer Main/Available Exchanges] Load Available Exchanges Success';
export const LOAD_AVAILABLE_EXCHANGES_ERROR = '[Peer Main/Available Exchanges] Load Available Exchanges Error';

export class LoadAvailableExchanges implements Action {
  readonly type = LOAD_AVAILABLE_EXCHANGES;

  constructor(public payload: any) {}
}

export class LoadAvailableExchangesSuccess implements Action {
  readonly type = LOAD_AVAILABLE_EXCHANGES_SUCCESS;

  constructor(public payload: AvailableExchangeItem[]) {}
}

export class LoadAvailableExchangesError implements Action {
  readonly type = LOAD_AVAILABLE_EXCHANGES_ERROR;
}

export type Actions
  = LoadAvailableExchanges
  | LoadAvailableExchangesSuccess
  | LoadAvailableExchangesError;
