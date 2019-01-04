import { Action } from '@ngrx/store';

import { ExchangeListItem, UpsertExchangeRequest } from 'libs/models/index';

export const LOAD_EXCHANGES = '[Peer Admin/Exchange List] Load Exchanges';
export const LOAD_EXCHANGES_SUCCESS = '[Peer Admin/Exchange List] Load Exchanges Success';
export const LOAD_EXCHANGES_ERROR = '[Peer Admin/Exchange List] Load Exchanges Error';
export const UPSERT_EXCHANGE = '[Peer Admin/Exchange List] Upsert Exchange';
export const UPSERT_EXCHANGE_SUCCESS = '[Peer Admin/Exchange List] Upsert Exchange Success';
export const UPSERT_EXCHANGE_ERROR = '[Peer Admin/Exchange List] Upsert Exchange Error';
export const DELETE_EXCHANGE = '[Peer Admin/Exchange List] Delete Exchange';
export const DELETE_EXCHANGE_SUCCESS = '[Peer Admin/Exchange List] Delete Exchange Success';
export const DELETE_EXCHANGE_ERROR = '[Peer Admin/Exchange List] Delete Exchange Error';
export const OPEN_CREATE_EXCHANGE_MODAL = '[Peer Admin/Exchange List] Open Create Exchange Modal';
export const CLOSE_CREATE_EXCHANGE_MODAL = '[Peer Admin/Exchange List] Close Create Exchange Modal';
export const OPEN_DELETE_EXCHANGE_MODAL = '[Peer Admin/Exchange List] Open Delete Exchange Modal';
export const CLOSE_DELETE_EXCHANGE_MODAL = '[Peer Admin/Exchange List] Close Delete Exchange Modal';

export class LoadExchanges implements Action {
  readonly type = LOAD_EXCHANGES;
  constructor(public payload: string) { }
}

export class LoadExchangesSuccess implements Action {
  readonly type = LOAD_EXCHANGES_SUCCESS;

  constructor(public payload: ExchangeListItem[]) { }
}

export class LoadExchangesError implements Action {
  readonly type = LOAD_EXCHANGES_ERROR;
}

export class OpenCreateExchangeModal implements Action {
  readonly type = OPEN_CREATE_EXCHANGE_MODAL;
}

export class CloseCreateExchangeModal implements Action {
  readonly type = CLOSE_CREATE_EXCHANGE_MODAL;
}

export class UpsertExchange implements Action {
  readonly type = UPSERT_EXCHANGE;

  constructor(public payload: UpsertExchangeRequest) { }
}

export class UpsertExchangeSuccess implements Action {
  readonly type = UPSERT_EXCHANGE_SUCCESS;

  constructor(public payload: ExchangeListItem) { }
}

export class UpsertExchangeError implements Action {
  readonly type = UPSERT_EXCHANGE_ERROR;

  constructor(public payload: string) { }
}

// Delete Exchange
export class OpenDeleteExchangeModal implements Action {
  readonly type = OPEN_DELETE_EXCHANGE_MODAL;
}

export class CloseDeleteExchangeModal implements Action {
  readonly type = CLOSE_DELETE_EXCHANGE_MODAL;
}

export class DeleteExchange implements Action {
  readonly type = DELETE_EXCHANGE;

  constructor(public payload: number) { }
}

export class DeleteExchangeSuccess implements Action {
  readonly type = DELETE_EXCHANGE_SUCCESS;
}

export class DeleteExchangeError implements Action {
  readonly type = DELETE_EXCHANGE_ERROR;
}

export type Actions
  = LoadExchanges
  | LoadExchangesSuccess
  | LoadExchangesError
  | OpenCreateExchangeModal
  | CloseCreateExchangeModal
  | UpsertExchange
  | UpsertExchangeSuccess
  | UpsertExchangeError
  | OpenDeleteExchangeModal
  | CloseDeleteExchangeModal
  | DeleteExchange
  | DeleteExchangeSuccess
  | DeleteExchangeError;
