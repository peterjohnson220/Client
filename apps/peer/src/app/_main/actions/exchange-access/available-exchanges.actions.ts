import { Action } from '@ngrx/store';

import { AvailableExchangeItem } from 'libs/models/peer/index';

export const LOAD_AVAILABLE_EXCHANGES  = '[Peer Main/Available Exchanges] Load Available Exchanges';
export const LOAD_AVAILABLE_EXCHANGES_SUCCESS  = '[Peer Main/Available Exchanges] Load Available Exchanges Success';
export const LOAD_AVAILABLE_EXCHANGES_ERROR = '[Peer Main/Available Exchanges] Load Available Exchanges Error';
export const SELECT_AVAILABLE_EXCHANGE = '[Peer Main/Available Exchanges] Select an Available Exchange';
export const UPDATE_SEARCH_TERM = '[Peer Main/Available Exchanges] Available Exchanges Update Search Term';
export const UPDATE_COMPANY_FILTER = '[Peer Main/Available Exchanges] Available Exchanges Update Company Filter';
export const RESET = '[Peer Main/Available Exchanges] Available Exchanges Reset';

export class LoadAvailableExchanges implements Action {
  readonly type = LOAD_AVAILABLE_EXCHANGES;
  readonly payload = null;
}

export class LoadAvailableExchangesSuccess implements Action {
  readonly type = LOAD_AVAILABLE_EXCHANGES_SUCCESS;

  constructor(public payload: AvailableExchangeItem[]) {}
}

export class LoadAvailableExchangesError implements Action {
  readonly type = LOAD_AVAILABLE_EXCHANGES_ERROR;
}

export class SelectAvailableExchange implements Action {
  readonly type = SELECT_AVAILABLE_EXCHANGE;

  constructor(public payload: AvailableExchangeItem) {}
}

export class UpdateSearchTerm implements Action {
  readonly type = UPDATE_SEARCH_TERM;

  constructor(public payload: string) {}
}

export class UpdateCompanyFilter implements Action {
  readonly type = UPDATE_COMPANY_FILTER;

  constructor(public payload: number) {}
}

export class Reset implements Action {
  readonly type = RESET;
}

export type Actions
  = LoadAvailableExchanges
  | LoadAvailableExchangesSuccess
  | LoadAvailableExchangesError
  | SelectAvailableExchange
  | UpdateSearchTerm
  | UpdateCompanyFilter
  | Reset;
