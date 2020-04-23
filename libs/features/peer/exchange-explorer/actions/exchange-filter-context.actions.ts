import { Action } from '@ngrx/store';

import { ExchangeScopeItem, ExchangeDataSearchFilterContext } from 'libs/models/peer';

export const TOGGLE_LIMIT_TO_PAYMARKET  = '[Features/Peer/Exchange Explorer] Toggle Limit To PayMarket';
export const TOGGLE_EXCLUDE_INDIRECT_JOB_MATCHES  = '[Features/Peer/Exchange Explorer] Toggle Exclude Indirect Job Matches';
export const TOGGLE_INCLUDE_UNTAGGED_EMPLOYEES = '[Features/Peer/Exchange Explorer] Toggle Include Untagged Employees';
export const SET_EXCHANGE_SCOPE_SELECTION = '[Features/Peer/Exchange Explorer] Set Scope Selection';
export const CLEAR_EXCHANGE_SCOPE_SELECTION = '[Features/Peer/Exchange Explorer] Clear Scope Selection';
export const SET_FILTER_CONTEXT = '[Features/Peer/Exchange Explorer] Set Filter Context';
export const SET_EXCHANGE_JOB_SELECTION = '[Features/Peer/Exchange Explorer] Set Exchange Job Selection';
export const RESET_STATE = '[Features/Peer/Exchange Explorer] Reset State';
export const SET_WEIGHTING_TYPE = '[Features/Peer/Exchange Explorer] Set Weighting Type';

export class ToggleLimitToPayMarket implements Action {
  readonly type = TOGGLE_LIMIT_TO_PAYMARKET;
}

export class ToggleExcludeIndirectJobMatches implements Action {
  readonly type = TOGGLE_EXCLUDE_INDIRECT_JOB_MATCHES;
}

export class ToggleIncludeUntaggedEmployees implements Action {
  readonly type = TOGGLE_INCLUDE_UNTAGGED_EMPLOYEES;
}

export class SetExchangeScopeSelection implements Action {
  readonly type = SET_EXCHANGE_SCOPE_SELECTION;

  constructor(public payload: ExchangeScopeItem) {}
}

export class ClearExchangeScopeSelection implements Action {
  readonly type = CLEAR_EXCHANGE_SCOPE_SELECTION;

  constructor() {}
}

export class SetFilterContext implements Action {
  readonly type = SET_FILTER_CONTEXT;

  constructor(public payload: ExchangeDataSearchFilterContext, public defaultScopeId?: string) {}
}

export class SetExchangeJobSelection implements Action {
  readonly type = SET_EXCHANGE_JOB_SELECTION;

  constructor(public payload: {exchangeJobId: number, similarExchangeJobIds: number[]}) {}
}

export class ResetState implements Action {
  readonly type = RESET_STATE;
}

export class SetWeightingType implements Action {
  readonly type = SET_WEIGHTING_TYPE;

  constructor(public payload: { weightingType: string }) {}
}

export type Actions
  = ToggleLimitToPayMarket
  | ToggleExcludeIndirectJobMatches
  | ToggleIncludeUntaggedEmployees
  | SetExchangeScopeSelection
  | SetFilterContext
  | ClearExchangeScopeSelection
  | SetExchangeJobSelection
  | ResetState
  | SetWeightingType;
