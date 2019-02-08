import { Action } from '@ngrx/store';

import { MDScopeResponse } from 'libs/models/payfactors-api';

import { PricingPaymarket, AddPayMarketFormData } from '../models';

export const GET_PAYMARKETS = '[Comphub/Markets Card] Get Pay Markets';
export const GET_PAYMARKETS_SUCCESS = '[Comphub/Markets Card] Get Pay Markets Success';
export const GET_PAYMARKETS_ERROR = '[Comphub/Markets Card] Get Pay Markets Error';
export const SET_PAYMARKET_FILTER = '[Comphub/Markets Card] Set Pay Markets Filter';
export const SET_SELECTED_PAYMARKET = '[Comphub/Markets Card] Set Selected Pay Market';
export const SAVE_PAYMARKET = '[Comphub/Markets Card] Save Pay Market';
export const SKIP_PAYMARKET = '[Comphub/Markets Card] Skip Pay Market';
export const GET_MD_SCOPE = '[Comphub/Markets Card] Get Market Data Scope';
export const GET_MD_SCOPE_SUCCESS = '[Comphub/Markets Card] Get Market Data Scope Success';
export const GET_MD_SCOPE_ERROR = '[Comphub/Markets Card] Get Market Data Scope Error';

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

  constructor(public payload: PricingPaymarket) {}
}

export class SavePayMarket implements Action {
  readonly type = SAVE_PAYMARKET;

  constructor(public payload: AddPayMarketFormData) {}
}

export class SkipPayMarket implements Action {
  readonly type = SKIP_PAYMARKET;
}

export class GetMarketDataScope implements Action {
  readonly type = GET_MD_SCOPE;

  constructor(public payload: { countryCode: string }) {}
}

export class GetMarketDataScopeSuccess implements Action {
  readonly type = GET_MD_SCOPE_SUCCESS;

  constructor(public payload: MDScopeResponse) {}
}

export class GetMarketDataScopeError implements Action {
  readonly type = GET_MD_SCOPE_ERROR;
}

export type Actions
  = GetPaymarkets
  | GetPaymarketsSuccess
  | GetPaymarketsError
  | SetPaymarketFilter
  | SetSelectedPaymarket
  | SavePayMarket
  | SkipPayMarket
  | GetMarketDataScope
  | GetMarketDataScopeSuccess
  | GetMarketDataScopeError;
