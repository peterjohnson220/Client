import { Action } from '@ngrx/store';

import { ExchangeScopeItem } from 'libs/models/peer/exchange-scope';
import { ExchangeScopeDetails } from 'libs/models/peer/requests';
import { ExchangeExplorerScopeResponse } from 'libs/models/payfactors-api/peer/exchange-data-filter/response';

export const LOAD_EXCHANGE_SCOPES_BY_JOBS  =
  '[Features/Peer/Exchange Explorer/Exchange Scopes] Load Exchange Scopes By Jobs';
export const LOAD_EXCHANGE_SCOPES_BY_JOBS_SUCCESS  =
  '[Features/Peer/Exchange Explorer/Exchange Scopes] Load Exchange Scopes By Jobs Success';
export const LOAD_EXCHANGE_SCOPES_BY_JOBS_ERROR  =
  '[Features/Peer/Exchange Explorer/Exchange Scopes] Load Exchange Scopes By Jobs Error';
export const LOAD_EXCHANGE_SCOPES_BY_EXCHANGE  =
  '[Features/Peer/Exchange Explorer/Exchange Scopes] Load Exchange Scopes By Exchange';
export const LOAD_EXCHANGE_SCOPES_BY_EXCHANGE_SUCCESS  =
  '[Features/Peer/Exchange Explorer/Exchange Scopes] Load Exchange Scopes By Exchange Success';
export const LOAD_EXCHANGE_SCOPES_BY_EXCHANGE_ERROR  =
  '[Features/Peer/Exchange Explorer/Exchange Scopes] Load Exchange Scopes By Exchange Error';
export const LOAD_EXCHANGE_SCOPE_DETAILS  =
  '[Features/Peer/Exchange Explorer/Exchange Scopes] Load Exchange Scope Details';
export const LOAD_EXCHANGE_SCOPE_DETAILS_SUCCESS  =
  '[Features/Peer/Exchange Explorer/Exchange Scopes] Load Exchange Scope Details Success';
export const LOAD_EXCHANGE_SCOPE_DETAILS_ERROR  =
  '[Features/Peer/Exchange Explorer/Exchange Scopes] Load Exchange Scope Details Error';
export const UPSERT_EXCHANGE_SCOPE =
  '[Features/Peer/Exchange Explorer/Exchange Scopes] Upsert Exchange Scope';
export const UPSERT_EXCHANGE_SCOPE_SUCCESS =
  '[Features/Peer/Exchange Explorer/Exchange Scopes] Upsert Exchange Scope Success';
export const UPSERT_EXCHANGE_SCOPE_ERROR =
  '[Features/Peer/Exchange Explorer/Exchange Scopes] Upsert Exchange Scope Error';
export const DELETE_EXCHANGE_SCOPE =
  '[Features/Peer/Exchange Explorer/Exchange Scopes] Delete Exchange Scope';
export const DELETE_EXCHANGE_SCOPE_SUCCESS =
  '[Features/Peer/Exchange Explorer/Exchange Scopes] Delete Exchange Scope Success';
export const DELETE_EXCHANGE_SCOPE_ERROR =
  '[Features/Peer/Exchange Explorer/Exchange Scopes] Delete Exchange Scope Error';
export const ENTER_DELETE_EXCHANGE_SCOPE_MODE =
  '[Features/Peer/Exchange Explorer/Exchange Scopes] Enter Delete Exchange Scope Mode';
export const EXIT_DELETE_EXCHANGE_SCOPE_MODE =
  '[Features/Peer/Exchange Explorer/Exchange Scopes] Exit Delete Exchange Scope Mode';
export const SET_EXCHANGE_SCOPE_TO_DELETE =
  '[Features/Peer/Exchange Explorer/Exchange Scopes] Set Exchange Scope To Delete';
export const RESET_INITIALLY_LOADED_STATE = '[Features/Peer/Exchange Explorer/Exchange Scopes] Reset Initially Loaded State';

export class LoadExchangeScopesByJobs implements Action {
  readonly type = LOAD_EXCHANGE_SCOPES_BY_JOBS;

  constructor(public payload?: {exchangeJobIds: number[]}) {}
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

  constructor(public payload: ExchangeExplorerScopeResponse) {}
}

export class LoadExchangeScopeDetailsError implements Action {
  readonly type = LOAD_EXCHANGE_SCOPE_DETAILS_ERROR;
}

export class UpsertExchangeScope implements Action {
  readonly type = UPSERT_EXCHANGE_SCOPE;

  constructor(public payload: ExchangeScopeDetails) {}
}

export class UpsertExchangeScopeSuccess implements Action {
  readonly type = UPSERT_EXCHANGE_SCOPE_SUCCESS;
}

export class UpsertExchangeScopeError implements Action {
  readonly type = UPSERT_EXCHANGE_SCOPE_ERROR;
}

export class DeleteExchangeScope implements Action {
  readonly type = DELETE_EXCHANGE_SCOPE;

  constructor(public payload: string) {}
}

export class DeleteExchangeScopeSuccess implements Action {
  readonly type = DELETE_EXCHANGE_SCOPE_SUCCESS;

  constructor(public payload: string) {}
}

export class DeleteExchangeScopeError implements Action {
  readonly type = DELETE_EXCHANGE_SCOPE_ERROR;
}

export class EnterDeleteExchangeScopeMode implements Action {
  readonly type = ENTER_DELETE_EXCHANGE_SCOPE_MODE;
}

export class ExitDeleteExchangeScopeMode implements Action {
  readonly type = EXIT_DELETE_EXCHANGE_SCOPE_MODE;
}

export class SetExchangeScopeToDelete implements Action {
  readonly type = SET_EXCHANGE_SCOPE_TO_DELETE;

  constructor(public payload: ExchangeScopeItem) {}
}

export class ResetInitiallyLoadedState implements Action {
  readonly type = RESET_INITIALLY_LOADED_STATE;
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
  | LoadExchangeScopeDetailsError
  | UpsertExchangeScope
  | UpsertExchangeScopeSuccess
  | UpsertExchangeScopeError
  | DeleteExchangeScope
  | DeleteExchangeScopeSuccess
  | DeleteExchangeScopeError
  | EnterDeleteExchangeScopeMode
  | ExitDeleteExchangeScopeMode
  | SetExchangeScopeToDelete
  | ResetInitiallyLoadedState;
