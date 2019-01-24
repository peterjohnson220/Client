import { Action } from '@ngrx/store';

import { PricingPaymarket } from '../models';

export const GET_PAYMARKETS = '[Comphub/Markets Page] Get Pay Markets';
export const GET_PAYMARKETS_SUCCESS = '[Comphub/Markets Page] Get Pay Markets Success';
export const GET_PAYMARKETS_ERROR = '[Comphub/Markets Page] Get Pay Markets Error';
export const SET_PAYMARKET_FILTER = '[Comphub/Markets Page] Set Pay Markets Filter';
export const SET_SELECTED_PAYMARKET = '[Comphub/Markets Page] Set Selected Pay Market';

export class GetPaymarkets implements Action {
  readonly type = GET_PAYMARKETS;

  constructor() {}
}

export class GetPaymarketsSuccess implements Action {
  readonly type = GET_PAYMARKETS_SUCCESS;

  constructor(public payload: PricingPaymarket[]) {}
}

export class GetPaymarketsError implements Action {
  readonly type = GET_PAYMARKETS_ERROR;

  constructor() {}
}

export class SetPaymarketFilter implements Action {
  readonly type = SET_PAYMARKET_FILTER;

  constructor(public payload: string) {}
}

export class SetSelectedPaymarket implements Action {
  readonly type = SET_SELECTED_PAYMARKET;

  constructor(public payload: number) {}
}

export type Actions
  = GetPaymarkets
  | GetPaymarketsSuccess
  | GetPaymarketsError
  | SetPaymarketFilter
  | SetSelectedPaymarket;
