import { Action } from '@ngrx/store';

import { ExchangeScopeItem } from 'libs/models/peer/exchange-scope';

export const LOAD_EXCHANGE_SCOPES_BY_JOBS  = '[Features/Peer/Exchange Scopes] Load Exchange Scopes By Jobs';
export const LOAD_EXCHANGE_SCOPES_BY_JOBS_SUCCESS  = '[Features/Peer/Exchange Scopes] Load Exchange Scopes By Jobs Success';
export const LOAD_EXCHANGE_SCOPES_BY_JOBS_ERROR  = '[Features/Peer/Exchange Scopes] Load Exchange Scopes By Jobs Error';
export const LOAD_EXCHANGE_SCOPES_BY_EXCHANGE  = '[Features/Peer/Exchange Scopes] Load Exchange Scopes By Exchange';
export const LOAD_EXCHANGE_SCOPES_BY_EXCHANGE_SUCCESS  = '[Features/Peer/Exchange Scopes] Load Exchange Scopes By Exchange Success';
export const LOAD_EXCHANGE_SCOPES_BY_EXCHANGE_ERROR  = '[Features/Peer/Exchange Scopes] Load Exchange Scopes By Exchange Error';
export const LOAD_EXCHANGE_SCOPE_DETAILS  = '[Features/Peer/Exchange Scopes] Load Exchange Scope Details';
export const LOAD_EXCHANGE_SCOPE_DETAILS_SUCCESS  = '[Features/Peer/Exchange Scopes] Load Exchange Scope Details Success';
export const LOAD_EXCHANGE_SCOPE_DETAILS_ERROR  = '[Features/Peer/Exchange Scopes] Load Exchange Scope Details Error';

export class LoadExchangeScopesByJobs implements Action {
  readonly type = LOAD_EXCHANGE_SCOPES_BY_JOBS;
}

export class LoadExchangeScopesByJobsSuccess implements Action {
  readonly type = LOAD_EXCHANGE_SCOPES_BY_JOBS_SUCCESS;

  constructor(public payload: ExchangeScopeItem[]) {}
}

export class LoadExchangeScopesByJobsError implements Action {
  readonly type = LOAD_EXCHANGE_SCOPES_BY_JOBS_ERROR;
}

export class LoadExchangeScopesByExchange implements Action {
  readonly type = LOAD_EXCHANGE_SCOPES_BY_EXCHANGE;

  constructor(public payload: number) {}
}

export class LoadExchangeScopesByExchangeSuccess implements Action {
  readonly type = LOAD_EXCHANGE_SCOPES_BY_EXCHANGE_SUCCESS;

  constructor(public payload: ExchangeScopeItem[]) {}
}

export class LoadExchangeScopesByExchangeError implements Action {
  readonly type = LOAD_EXCHANGE_SCOPES_BY_EXCHANGE_ERROR;
}

export class LoadExchangeScopeDetails implements Action {
  readonly type = LOAD_EXCHANGE_SCOPE_DETAILS;
}

export class LoadExchangeScopeDetailsSuccess implements Action {
  readonly type = LOAD_EXCHANGE_SCOPE_DETAILS_SUCCESS;

  constructor(public payload: any) {}
}

export class LoadExchangeScopeDetailsError implements Action {
  readonly type = LOAD_EXCHANGE_SCOPE_DETAILS_ERROR;
}

export type Actions
  = LoadExchangeScopesByJobs
  | LoadExchangeScopesByJobsSuccess
  | LoadExchangeScopesByJobsError
  | LoadExchangeScopesByExchange
  | LoadExchangeScopesByExchangeSuccess
  | LoadExchangeScopesByExchangeError
  | LoadExchangeScopeDetails
  | LoadExchangeScopeDetailsSuccess
  | LoadExchangeScopeDetailsError;
