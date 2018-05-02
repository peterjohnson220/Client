import { Action } from '@ngrx/store';

import { ExchangeListItem, UpsertExchangeRequest } from 'libs/models';

export const LOADING_EXCHANGES  = '[Peer Shared/Exchange List] Loading Exchanges';
export const LOADING_EXCHANGES_SUCCESS  = '[Peer Shared/Exchange List] Loading Exchanges Success';
export const LOADING_EXCHANGES_ERROR  = '[Peer Shared/Exchange List] Loading Exchanges Error';
export const UPSERTING_EXCHANGE = '[Peer Shared/Exchange List] Upserting Exchange';
export const UPSERTING_EXCHANGE_SUCCESS = '[Peer Shared/Exchange List] Upserting Exchange Success';
export const UPSERTING_EXCHANGE_ERROR = '[Peer Shared/Exchange List] Upserting Exchange Error';
export const OPEN_CREATE_EXCHANGE_MODAL = '[Peer Shared/Exchange List] Open Create Exchange Modal';
export const CLOSE_CREATE_EXCHANGE_MODAL = '[Peer Shared/Exchange List] Close Create Exchange Modal';

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

export class OpenCreateExchangeModal implements Action {
  readonly type = OPEN_CREATE_EXCHANGE_MODAL;
}

export class CloseCreateExchangeModal implements Action {
  readonly type = CLOSE_CREATE_EXCHANGE_MODAL;
}

export class UpsertingExchange implements Action {
  readonly type = UPSERTING_EXCHANGE;

  constructor(public payload: UpsertExchangeRequest) {}
}

export class UpsertingExchangeSuccess implements Action {
  readonly type = UPSERTING_EXCHANGE_SUCCESS;

  constructor(public payload: ExchangeListItem) {}
}

export class UpsertingExchangeError implements Action {
  readonly type = UPSERTING_EXCHANGE_ERROR;

  constructor(public payload: string) {}
}

export type Actions
  = LoadingExchanges
  | LoadingExchangesSuccess
  | LoadingExchangesError
  | OpenCreateExchangeModal
  | CloseCreateExchangeModal
  | UpsertingExchange
  | UpsertingExchangeSuccess
  | UpsertingExchangeError;
