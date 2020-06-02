import { Action } from '@ngrx/store';

import { PayMarketWithMdScope } from 'libs/models';

export const OPEN_PAY_MARKET_MODAL = '[Pay Market Management / Pay Market Modal] Open Pay Market Modal';
export const CLOSE_PAY_MARKET_MODAL = '[Pay Market Management / Pay Market Modal] Close Pay Market Modal';
export const LOAD_USER_DEFAULT_PAY_MARKET = '[Pay Market Management / General Form] Load User Default Pay Market';
export const LOAD_PAY_MARKET = '[Pay Market Management / Pay Market Modal] Load Pay Market';
export const LOAD_PAY_MARKET_SUCCESS = '[Pay Market Management / Pay Market Modal] Load Pay Market Success';
export const LOAD_PAY_MARKET_ERROR = '[Pay Market Management / Pay Market Modal] Load Pay Market Error';

export class OpenPayMarketModal implements Action {
  readonly type = OPEN_PAY_MARKET_MODAL;
  constructor(public payload?: { payMarketId: number }) {}
}

export class ClosePayMarketModal implements Action {
  readonly type = CLOSE_PAY_MARKET_MODAL;
  constructor() {}
}

export class LoadUserDefaultPayMarket implements Action {
  readonly type = LOAD_USER_DEFAULT_PAY_MARKET;
  constructor() {}
}

export class LoadPayMarket implements Action {
  readonly type = LOAD_PAY_MARKET;
  constructor(public payload: { payMarketId: number }) {}
}

export class LoadPayMarketSuccess implements Action {
  readonly type = LOAD_PAY_MARKET_SUCCESS;
  constructor(public payload: PayMarketWithMdScope) {}
}

export class LoadPayMarketError implements Action {
  readonly type = LOAD_PAY_MARKET_ERROR;
  constructor() {}
}

export type Actions
  = OpenPayMarketModal
  | ClosePayMarketModal
  | LoadUserDefaultPayMarket
  | LoadPayMarket
  | LoadPayMarketSuccess
  | LoadPayMarketError;
