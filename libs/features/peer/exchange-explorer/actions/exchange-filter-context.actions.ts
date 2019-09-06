import { Action } from '@ngrx/store';

import {
  PeerMapScopeSystemSideBarInfo,
  ExchangeScopeItem, ExchangeDataSearchFilterContext
} from 'libs/models/peer';

export const TOGGLE_LIMIT_TO_PAYMARKET  = '[Features/Peer/Exchange Explorer] Toggle Limit To PayMarket';
export const TOGGLE_EXCLUDE_INDIRECT_JOB_MATCHES  = '[Features/Peer/Exchange Explorer] Toggle Exclude Indirect Job Matches';
export const TOGGLE_INCLUDE_UNTAGGED_EMPLOYEES = '[Features/Peer/Exchange Explorer] Toggle Include Untagged Employees';
export const LIMIT_TO_EXCHANGE = '[Features/Peer/Exchange Explorer] Limit to Exchange';
export const SET_EXCHANGE_SCOPE_SELECTION = '[Features/Peer/Exchange Explorer] Set Scope Selection';
export const SET_FILTER_CONTEXT = '[Features/Peer/Exchange Explorer] Set Filter Context';

export class ToggleLimitToPayMarket implements Action {
  readonly type = TOGGLE_LIMIT_TO_PAYMARKET;
}

export class ToggleExcludeIndirectJobMatches implements Action {
  readonly type = TOGGLE_EXCLUDE_INDIRECT_JOB_MATCHES;
}

export class ToggleIncludeUntaggedEmployees implements Action {
  readonly type = TOGGLE_INCLUDE_UNTAGGED_EMPLOYEES;
}

export class LimitToExchange implements Action {
  readonly type = LIMIT_TO_EXCHANGE;

  constructor(public payload: number) { }
}

export class SetExchangeScopeSelection implements Action {
  readonly type = SET_EXCHANGE_SCOPE_SELECTION;

  constructor(public payload: ExchangeScopeItem) {}
}

export class SetFilterContext implements Action {
  readonly type = SET_FILTER_CONTEXT;

  constructor(public payload: ExchangeDataSearchFilterContext) {}
}

export type Actions
  = ToggleLimitToPayMarket
  | ToggleExcludeIndirectJobMatches
  | ToggleIncludeUntaggedEmployees
  | LimitToExchange
  | SetExchangeScopeSelection
  | SetFilterContext;
