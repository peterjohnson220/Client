import { Action } from '@ngrx/store';

import { ExchangeScopes } from 'libs/models/peer/exchange-scope';

export const LOAD_COMPANY_EXCHANGE_SCOPES = '[Pay Market Management / Exchange Scopes] Load Company Exchange Scopes';
export const LOAD_COMPANY_EXCHANGE_SCOPES_SUCCESS = '[Pay Market Management / Exchange Scopes] Load Company Exchange Scopes Success';
export const LOAD_COMPANY_EXCHANGE_SCOPES_ERROR = '[Pay Market Management / Exchange Scopes] Load Company Exchange Scopes Error';
export const ADD_EXCHANGE_SCOPE = '[Pay Market Management / Exchange Scopes] Add Exchange Scope';
export const REMOVE_EXCHANGE_SCOPE = '[Pay Market Management / Exchange Scopes] Remove Exchange Scope';
export const RESET_EXCHANGE_SCOPES = '[Pay Market Management / Exchange Scopes] Reset Exchange Scopes';

export class LoadCompanyExchangeScopes implements Action {
  readonly type = LOAD_COMPANY_EXCHANGE_SCOPES;
  constructor() {}
}

export class LoadCompanyExchangeScopesSuccess implements Action {
  readonly type = LOAD_COMPANY_EXCHANGE_SCOPES_SUCCESS;
  constructor(public payload: ExchangeScopes[]) {}
}

export class LoadCompanyExchangeScopesError implements Action {
  readonly type = LOAD_COMPANY_EXCHANGE_SCOPES_ERROR;
  constructor() {}
}

export class AddExchangeScope implements Action {
  readonly type = ADD_EXCHANGE_SCOPE;
  constructor(public payload: ExchangeScopes) {}
}

export class RemoveExchangeScope implements Action {
  readonly type = REMOVE_EXCHANGE_SCOPE;
  constructor(public payload: { exchangeScopeIndex: number }) {}
}

export class ResetExchangeScopes implements Action {
  readonly type = RESET_EXCHANGE_SCOPES;
  constructor() {}
}


export type Actions
  = LoadCompanyExchangeScopes
  | LoadCompanyExchangeScopesSuccess
  | LoadCompanyExchangeScopesError
  | AddExchangeScope
  | RemoveExchangeScope
  | ResetExchangeScopes;
