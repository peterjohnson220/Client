import { Action } from '@ngrx/store';

import { JobPayMarket } from '../models';

export const LOAD_PAYMARKETS = '[Project Add Jobs/Paymarkets Container] Load all paymarkets';
export const LOAD_PAYMARKETS_SUCCESS = '[Project Add Jobs/Paymarkets Container] Load all paymarkets success';
export const LOAD_PAYMARKETS_ERROR = '[Project Add Jobs/Paymarkets Container] Load all paymarkets error';
export const TOGGLE_PAYMARKET_SELECTION = '[Project Add Jobs/Paymarkets Container] Toggle paymarket selection';
export const SET_DEFAULT_PAYMARKET = '[Project Add Jobs/Paymarkets Container] Set Default Paymarket';
export const RESET_PAYMARKETS = '[Project Add Jobs/Paymarkets Container] Reset Paymarkets';
export const SET_SEARCH_TERM = '[Project Add Jobs/Paymarkets Container] Set Search Term';

export class LoadPaymarkets implements Action {
  readonly type = LOAD_PAYMARKETS;

  constructor() {}
}

export class LoadPaymarketsSuccess implements Action {
  readonly type = LOAD_PAYMARKETS_SUCCESS;

  constructor(public payload: JobPayMarket[]) {}
}

export class LoadPaymarketsError implements Action {
  readonly type = LOAD_PAYMARKETS_ERROR;

  constructor() {}
}
export class TogglePaymarketSelection implements Action {
  readonly type = TOGGLE_PAYMARKET_SELECTION;

  constructor(public payload: number) {}
}
export class SetDefaultPaymarket implements Action {
  readonly type = SET_DEFAULT_PAYMARKET;

  constructor(public payload: number) {}
}
export class ResetPaymarkets implements Action {
  readonly type = RESET_PAYMARKETS;

  constructor() {}
}
export class SetSearchTerm implements Action {
  readonly type = SET_SEARCH_TERM;

  constructor(public payload: string) {}
}
export type Actions
  = LoadPaymarkets
  | LoadPaymarketsSuccess
  | LoadPaymarketsError
  | TogglePaymarketSelection
  | SetDefaultPaymarket
  | ResetPaymarkets
  | SetSearchTerm;
