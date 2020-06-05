import { Action } from '@ngrx/store';

import { PayMarket, PayMarketWithMdScope } from 'libs/models';

export const OPEN_PAY_MARKET_MODAL = '[Pay Market Management / Pay Market Modal] Open Pay Market Modal';
export const CLOSE_PAY_MARKET_MODAL = '[Pay Market Management / Pay Market Modal] Close Pay Market Modal';
export const LOAD_USER_DEFAULT_PAY_MARKET = '[Pay Market Management / General Form] Load User Default Pay Market';
export const LOAD_PAY_MARKET = '[Pay Market Management / Pay Market Modal] Load Pay Market';
export const LOAD_PAY_MARKET_SUCCESS = '[Pay Market Management / Pay Market Modal] Load Pay Market Success';
export const LOAD_PAY_MARKET_ERROR = '[Pay Market Management / Pay Market Modal] Load Pay Market Error';
export const ADD_PAY_MARKET = '[Pay Market Management / Pay Market Modal] Add Pay Market';
export const ADD_PAY_MARKET_SUCCESS = '[Pay Market Management / Pay Market Modal] Add Pay Market Success';
export const UPDATE_PAY_MARKET = '[Pay Market Management / Pay Market Modal] Update Pay Market';
export const UPDATE_PAY_MARKET_SUCCESS = '[Pay Market Management / Pay Market Modal] Update Pay Market Success';
export const ADD_OR_UPDATE_PAY_MARKET_ERROR = '[Pay Market Management / Pay Market Modal] Add Or Update Pay Market Error';

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

export class AddPayMarket implements Action {
  readonly type = ADD_PAY_MARKET;
  constructor(public payload: { PayMarketDto: PayMarket}) {}
}

export class AddPayMarketSuccess implements Action {
  readonly type = ADD_PAY_MARKET_SUCCESS;
  constructor() {}
}

export class UpdatePayMarket implements Action {
  readonly type = UPDATE_PAY_MARKET;
  constructor(public payload: { PayMarketDto: PayMarket}) {}
}

export class UpdatePayMarketSuccess implements Action {
  readonly type = UPDATE_PAY_MARKET_SUCCESS;
  constructor() {}
}

export class AddOrUpdatePayMarketError implements Action {
  readonly type = ADD_OR_UPDATE_PAY_MARKET_ERROR;
  constructor(public payload: string) {}
}

export type Actions
  = OpenPayMarketModal
  | ClosePayMarketModal
  | LoadUserDefaultPayMarket
  | LoadPayMarket
  | LoadPayMarketSuccess
  | LoadPayMarketError
  | AddPayMarket
  | AddPayMarketSuccess
  | UpdatePayMarket
  | UpdatePayMarketSuccess
  | AddOrUpdatePayMarketError;
