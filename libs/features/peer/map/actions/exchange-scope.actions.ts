import { Action } from '@ngrx/store';

import { ExchangeScopeItem } from 'libs/models/peer/exchange-scope';

export const LOAD_EXCHANGE_SCOPES  = '[Features/Peer/Exchange Scopes] Load Exchange Scopes';
export const LOAD_EXCHANGE_SCOPES_SUCCESS  = '[Features/Peer/Exchange Scopes] Load Exchange Scopes Success';
export const LOAD_EXCHANGE_SCOPES_ERROR  = '[Features/Peer/Exchange Scopes] Load Exchange Scopes Error';
export const LOAD_EXCHANGE_SCOPE_DETAILS  = '[Features/Peer/Exchange Scopes] Load Exchange Scope Details';
export const LOAD_EXCHANGE_SCOPE_DETAILS_SUCCESS  = '[Features/Peer/Exchange Scopes] Load Exchange Scope Details Success';
export const LOAD_EXCHANGE_SCOPE_DETAILS_ERROR  = '[Features/Peer/Exchange Scopes] Load Exchange Scope Details Error';

export class LoadExchangeScopes implements Action {
  readonly type = LOAD_EXCHANGE_SCOPES;
}

export class LoadExchangeScopesSuccess implements Action {
  readonly type = LOAD_EXCHANGE_SCOPES_SUCCESS;

  constructor(public payload: ExchangeScopeItem[]) {}
}

export class LoadExchangeScopesError implements Action {
  readonly type = LOAD_EXCHANGE_SCOPES_ERROR;
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
  = LoadExchangeScopes
  | LoadExchangeScopesSuccess
  | LoadExchangeScopesError
  | LoadExchangeScopeDetails
  | LoadExchangeScopeDetailsSuccess
  | LoadExchangeScopeDetailsError;
