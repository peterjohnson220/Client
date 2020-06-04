import { Action } from '@ngrx/store';

export const OPEN_PAY_MARKET_MODAL = '[Pay Market Management / Pay Market Modal] Open Pay Market Modal';
export const CLOSE_PAY_MARKET_MODAL = '[Pay Market Management / Pay Market Modal] Close Pay Market Modal';

export class OpenPayMarketModal implements Action {
  readonly type = OPEN_PAY_MARKET_MODAL;
  constructor() {}
}

export class ClosePayMarketModal implements Action {
  readonly type = CLOSE_PAY_MARKET_MODAL;
  constructor() {}
}

export type Actions
  = OpenPayMarketModal
  | ClosePayMarketModal;
