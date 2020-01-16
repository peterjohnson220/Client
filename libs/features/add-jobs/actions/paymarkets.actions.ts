import { Action } from '@ngrx/store';

import { JobPayMarket } from 'libs/features/add-jobs/models';

export const LOAD_PAYMARKETS = '[Add Jobs/Paymarkets Container] Load all paymarkets';
export const LOAD_PAYMARKETS_SUCCESS = '[Add Jobs/Paymarkets Container] Load all paymarkets success';
export const LOAD_PAYMARKETS_ERROR = '[Add Jobs/Paymarkets Container] Load all paymarkets error';
export const TOGGLE_PAYMARKET_SELECTION = '[Add Jobs/Paymarkets Container] Toggle paymarket selection';
export const SET_DEFAULT_PAYMARKET = '[Add Jobs/Paymarkets Container] Set Default Paymarket';
export const CLEAR_PAYMARKETS = '[Add Jobs/Paymarkets Container] Clear Paymarkets';
export const SET_SEARCH_TERM = '[Add Jobs/Paymarkets Container] Set Search Term';
export const RESET_PAYMARKET_SELECTIONS = '[Add Jobs/Paymarkets Container] Reset Paymarket Selections';

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
export class ClearPayMarkets implements Action {
  readonly type = CLEAR_PAYMARKETS;

  constructor() {}
}
export class SetSearchTerm implements Action {
  readonly type = SET_SEARCH_TERM;

  constructor(public payload: string) {}
}

export class ResetPayMarketSelections implements Action {
  readonly type = RESET_PAYMARKET_SELECTIONS;

  constructor() {}
}

export type Actions
  = LoadPaymarkets
  | LoadPaymarketsSuccess
  | LoadPaymarketsError
  | TogglePaymarketSelection
  | SetDefaultPaymarket
  | ClearPayMarkets
  | SetSearchTerm
  | ResetPayMarketSelections;
