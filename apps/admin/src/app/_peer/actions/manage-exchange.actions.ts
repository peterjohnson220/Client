import { Action } from '@ngrx/store';

import { Exchange } from 'libs/models';

export const LOADING_EXCHANGE  = '[Peer Admin/Manage Exchange] Loading Exchange';
export const LOADING_EXCHANGE_SUCCESS  = '[Peer Admin/Manage Exchange] Loading Exchange Success';
export const LOADING_EXCHANGE_ERROR  = '[Peer Admin/Manage Exchange] Loading Exchange Error';

export class LoadingExchange implements Action {
  readonly type = LOADING_EXCHANGE;
}

export class LoadingExchangeSuccess implements Action {
  readonly type = LOADING_EXCHANGE_SUCCESS;

  constructor(public payload: Exchange) {}
}

export class LoadingExchangeError implements Action {
  readonly type = LOADING_EXCHANGE_ERROR;
}

export type Actions
  = LoadingExchange
  | LoadingExchangeSuccess
  | LoadingExchangeError;




