import { Action } from '@ngrx/store';

import { ExchangeListItem } from 'libs/models';

export const LOADING_EXCHANGES  = '[Peer Admin/Exchange List] Loading Exchanges';
export const LOADING_EXCHANGES_SUCCESS  = '[Peer Admin/Exchange List] Loading Exchanges Success';
export const LOADING_EXCHANGES_ERROR  = '[Peer Admin/Exchange List] Loading Exchanges Error';

export class LoadingExchanges implements Action {
  readonly type = LOADING_EXCHANGES;
}

export class LoadingExchangesSuccess implements Action {
  readonly type = LOADING_EXCHANGES_SUCCESS;

  constructor(public payload: ExchangeListItem[]) {}
}

export class LoadingExchangesError implements Action {
  readonly type = LOADING_EXCHANGES_ERROR;
}

export type Actions
  = LoadingExchanges
  | LoadingExchangesSuccess
  | LoadingExchangesError;
