import { Action } from '@ngrx/store';
import {ExchangeScopes} from 'libs/models/peer/exchange-scope';

export const LOAD_EXCHANGE_SCOPES =
  '[Legacy Content/Paymarket Exchange Scope] Load Exchange Scopes';
export const LOAD_EXCHANGE_SCOPES_SUCCESS =
  '[Legacy Content/Paymarket Exchange Scope] Load Exchange Scopes Success';
export const LOAD_EXCHANGE_SCOPES_ERROR =
  '[Legacy Content/Paymarket Exchange Scope] Load Exchange Scopes Error';
export const LOAD_EXCHANGE_SCOPE_SELECTIONS =
  '[Legacy Content/Paymarket Exchange Scope] Load Exchange Scope Selections';
export const LOAD_EXCHANGE_SCOPE_SELECTIONS_SUCCESS =
  '[Legacy Content/Paymarket Exchange Scope] Load Exchange Scope Selections Success';
export const LOAD_EXCHANGE_SCOPE_SELECTIONS_ERROR =
  '[Legacy Content/Paymarket Exchange Scope] Load Exchange Scope Selections Error';
export const ADD_ROW =
  '[Legacy Content/Paymarket Exchange Scope] Add Row';
export const DELETE_ROW =
  '[Legacy Content/Paymarket Exchange Scope] Delete Row';
export const SELECT_EXCHANGE =
  '[Legacy Content/Paymarket Exchange Scope] Select Exchange';
export const SELECT_SCOPE =
  '[Legacy Content/Paymarket Exchange Scope] Select Scope';
export const GET_EXCHANGE_SCOPE_SELECTIONS  =
  '[Legacy Content/Paymarket Exchange Scope] Get Exchange Scope Selections';
export const PUBLISH_EXCHANGE_SCOPE_SELECTIONS  =
  '[Legacy Content/Paymarket Exchange Scope] Publish Exchange Scope Selections';

export class LoadExchangeScopes implements Action {
  readonly type = LOAD_EXCHANGE_SCOPES;
}

export class LoadExchangeScopesSuccess implements Action {
  readonly type = LOAD_EXCHANGE_SCOPES_SUCCESS;
  constructor(public payload: ExchangeScopes[]) {}
}

export class LoadExchangeScopesError implements Action {
  readonly type = LOAD_EXCHANGE_SCOPES_ERROR;
}

export class LoadExchangeScopeSelections implements Action {
  readonly type = LOAD_EXCHANGE_SCOPE_SELECTIONS;
  constructor(public payload: number) {}
}

export class LoadExchangeScopeSelectionsSuccess implements Action {
  readonly type = LOAD_EXCHANGE_SCOPE_SELECTIONS_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadExchangeScopeSelectionsError implements Action {
  readonly type = LOAD_EXCHANGE_SCOPE_SELECTIONS_ERROR;
}

export class AddRow implements Action {
  readonly type = ADD_ROW;
}

export class DeleteRow implements Action {
  readonly type = DELETE_ROW;
  constructor(public row: number) {}
}

export class SelectExchange implements Action {
  readonly type = SELECT_EXCHANGE;
  constructor(public payload: any) {
  }
}

export class SelectScope implements Action {
  readonly type = SELECT_SCOPE;
  constructor(public payload: any) {}
}

export class GetExchangeScopeSelections implements Action {
  readonly type = GET_EXCHANGE_SCOPE_SELECTIONS;
}

export class PublishExchangeScopeSelections implements Action {
  readonly type = PUBLISH_EXCHANGE_SCOPE_SELECTIONS;
  constructor(public payload: any) {}
}

export type Actions
  = LoadExchangeScopes
  | LoadExchangeScopesSuccess
  | LoadExchangeScopesError
  | LoadExchangeScopeSelections
  | LoadExchangeScopeSelectionsSuccess
  | LoadExchangeScopeSelectionsError
  | AddRow
  | DeleteRow
  | SelectExchange
  | SelectScope
  | GetExchangeScopeSelections
  | PublishExchangeScopeSelections;
