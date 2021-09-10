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
export const SET_INCLUDE_COMPANY_SCOPES = '[Features/Peer/Exchange Explorer/Exchange Scopes] Set Include Company Scopes';
export const SET_INCLUDE_STANDARD_SCOPES = '[Feature/Peer/Exchange Explorer/Exchange Scopes] Set Include Standard Scopes';
export const SET_EXCHANGE_SCOPES = '[Feature/Peer/Exchange Explorer/Exchange Scopes] Set Exchange Scopes';
export const SET_EXCHANGE_SCOPE_NAME_FILTER = '[Feature/Peer/Exchange Explorer/Exchange Scopes] Set Exchange Scope Name Filter';
export const SET_IS_FORCED_BY_EXCHANGE = '[Feature/Peer/Exchange Explorer/Exchange Scopes] Set Forced By Exchange';

export class LoadExchangeScopesByJobs implements Action {
  readonly type = LOAD_EXCHANGE_SCOPES_BY_JOBS;

  constructor(public payload?: {exchangeJobIds: number[]}) {}
}

export class LoadExchangeScopesByJobsSuccess implements Action {
  readonly type = LOAD_EXCHANGE_SCOPES_BY_JOBS_SUCCESS;

}

export class LoadExchangeScopesByJobsError implements Action {
  readonly type = LOAD_EXCHANGE_SCOPES_BY_JOBS_ERROR;
}

export class LoadExchangeScopesByExchange implements Action {
  readonly type = LOAD_EXCHANGE_SCOPES_BY_EXCHANGE;
}

export class LoadExchangeScopesByExchangeSuccess implements Action {
  readonly type = LOAD_EXCHANGE_SCOPES_BY_EXCHANGE_SUCCESS;

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

  constructor(public payload: {scopeId: number, isStandardScope: boolean}) {}
}

export class DeleteExchangeScopeSuccess implements Action {
  readonly type = DELETE_EXCHANGE_SCOPE_SUCCESS;

  constructor(public payload: number) {}
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
export class SetIncludeCompanyScopes implements Action {
  readonly type = SET_INCLUDE_COMPANY_SCOPES;
  constructor(public payload: boolean) {}
}
export class SetIncludeStandardScopes implements Action {
  readonly type = SET_INCLUDE_STANDARD_SCOPES;
  constructor(public payload: boolean) {}
}
export class SetExchangeScopes implements Action {
  readonly type = SET_EXCHANGE_SCOPES;
  constructor(public payload: ExchangeScopeItem[]) {}
}
export class SetExchangeScopeNameFilter implements Action {
  readonly type = SET_EXCHANGE_SCOPE_NAME_FILTER;
  constructor(public payload: string) {}
}
export class SetIsForcedByExchange implements Action {
  readonly type = SET_IS_FORCED_BY_EXCHANGE;
  constructor(public payload: boolean){}
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
  | ResetInitiallyLoadedState
  | SetIncludeCompanyScopes
  | SetIncludeStandardScopes
  | SetExchangeScopes
  | SetExchangeScopeNameFilter
  | SetIsForcedByExchange;
