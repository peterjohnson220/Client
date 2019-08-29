import { Action } from '@ngrx/store';

import {
  SystemFilter,
  SystemFilterRequest,
  PeerMapScopeSystemSideBarInfo,
  ExchangeScopeItem
} from 'libs/models/peer';

export const TOGGLE_LIMIT_TO_PAYMARKET  = '[Features/Peer/Exchange Explorer] Toggle Limit To PayMarket';
export const TOGGLE_EXCLUDE_INDIRECT_JOB_MATCHES  = '[Features/Peer/Exchange Explorer] Toggle Exclude Indirect Job Matches';
export const TOGGLE_INCLUDE_UNTAGGED_EMPLOYEES = '[Features/Peer/Exchange Explorer] Toggle Include Untagged Employees';
export const LOAD_PAYMARKET_INFORMATION  = '[Features/Peer/Exchange Explorer] Load PayMarket Information';
export const LOAD_PAYMARKET_INFORMATION_SUCCESS  = '[Features/Peer/Exchange Explorer] Load PayMarket Information Success';
export const LOAD_SYSTEM_FILTER = '[Features/Peer/Exchange Explorer] Load System Filter';
export const LOAD_SYSTEM_FILTER_SUCCESS = '[Features/Peer/Exchange Explorer] Load System Filter Success';
export const LIMIT_TO_EXCHANGE = '[Features/Peer/Exchange Explorer] Limit to Exchange';
export const APPLY_CUT_CRITERIA = '[Features/Peer/Exchange Explorer] Apply Cut Criteria';
export const APPLY_SCOPE_CRITERIA = '[Features/Peer/Exchange Explorer] Apply Scope Criteria';
export const SET_EXCHANGE_SCOPE_SELECTION = '[Features/Peer/Exchange Explorer] Set Scope Selection';
export const LOAD_ASSOCIATED_EXCHANGE_JOBS =  '[Features/Peer/Exchange Explorer] Load Associated Exchange Jobs';
export const LOAD_ASSOCIATED_EXCHANGE_JOBS_SUCCESS =  '[Features/Peer/Exchange Explorer] Load Associated Exchange Jobs Success';

export class ToggleLimitToPayMarket implements Action {
  readonly type = TOGGLE_LIMIT_TO_PAYMARKET;
}

export class ToggleExcludeIndirectJobMatches implements Action {
  readonly type = TOGGLE_EXCLUDE_INDIRECT_JOB_MATCHES;
}

export class ToggleIncludeUntaggedEmployees implements Action {
  readonly type = TOGGLE_INCLUDE_UNTAGGED_EMPLOYEES;
}

export class LoadPayMarketInformation implements Action {
  readonly type = LOAD_PAYMARKET_INFORMATION;

  constructor(public payload: number) {}
}

export class LoadPayMarketInformationSuccess implements Action {
  readonly type = LOAD_PAYMARKET_INFORMATION_SUCCESS;

  constructor(public payload: any) {}
}

export class LoadSystemFilter implements Action {
  readonly type = LOAD_SYSTEM_FILTER;

  constructor(public payload: SystemFilterRequest) { }
}

export class LoadSystemFilterSuccess implements Action {
  readonly type = LOAD_SYSTEM_FILTER_SUCCESS;

  constructor(public payload: SystemFilter) { }
}

export class LimitToExchange implements Action {
  readonly type = LIMIT_TO_EXCHANGE;

  constructor(public payload: number) { }
}

export class ApplyCutCriteria implements Action {
  readonly type = APPLY_CUT_CRITERIA;

  constructor(public payload: PeerMapScopeSystemSideBarInfo) {}
}

export class ApplyScopeCriteria implements Action {
  readonly type = APPLY_SCOPE_CRITERIA;

  constructor(public payload: any) {}
}

export class SetExchangeScopeSelection implements Action {
  readonly type = SET_EXCHANGE_SCOPE_SELECTION;

  constructor(public payload: ExchangeScopeItem) {}
}

export class LoadAssociatedExchangeJobs implements Action {
  readonly type = LOAD_ASSOCIATED_EXCHANGE_JOBS;

  constructor(public payload: number) { }
}

export class LoadAssociatedExchangeJobsSuccess implements Action {
  readonly type = LOAD_ASSOCIATED_EXCHANGE_JOBS_SUCCESS;

  constructor(public payload: string[]) { }
}

export type Actions
  = ToggleLimitToPayMarket
  | ToggleExcludeIndirectJobMatches
  | ToggleIncludeUntaggedEmployees
  | LoadPayMarketInformation
  | LoadPayMarketInformationSuccess
  | LoadSystemFilter
  | LoadSystemFilterSuccess
  | LimitToExchange
  | ApplyCutCriteria
  | ApplyScopeCriteria
  | SetExchangeScopeSelection
  | LoadAssociatedExchangeJobs
  | LoadAssociatedExchangeJobsSuccess;
