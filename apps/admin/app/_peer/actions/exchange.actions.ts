import { Action } from '@ngrx/store';

import { Exchange } from 'libs/models';

export const LOAD_EXCHANGE  = '[Peer Shared] Load Exchange';
export const LOAD_EXCHANGE_SUCCESS  = '[Peer Shared] Load Exchange Success';
export const LOAD_EXCHANGE_ERROR  = '[Peer Shared] Load Exchange Error';

export class LoadExchange implements Action {
  readonly type = LOAD_EXCHANGE;

  constructor(public payload: number) {}
}

export class LoadExchangeSuccess implements Action {
  readonly type = LOAD_EXCHANGE_SUCCESS;

  constructor(public payload: Exchange) {}
}

export class LoadExchangeError implements Action {
  readonly type = LOAD_EXCHANGE_ERROR;
}

export type Actions
  = LoadExchange
  | LoadExchangeSuccess
  | LoadExchangeError;




