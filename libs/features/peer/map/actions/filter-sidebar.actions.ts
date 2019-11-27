import { Action } from '@ngrx/store';

import { SystemFilter, SystemFilterRequest, PeerMapScopeSystemSideBarInfo,
  ExchangeScopeItem, ToggleAggregateGroupSelections } from 'libs/models/peer';

import { AggregateSelectionInfo } from '../models';
import {ExchangeJobExchangeDetail} from '../../models';

export const LOAD_FILTER_AGGREGATES  = '[Features/Peer/Sidebar] Load Filter Aggregates';
export const LOAD_FILTER_AGGREGATES_SUCCESS  = '[Features/Peer/Sidebar] Load Filter Aggregates Success';
export const LOAD_FILTER_AGGREGATES_ERROR  = '[Features/Peer/Sidebar] Load Filter Aggregates Error';
export const TOGGLE_AGGREGATE_SELECTED  = '[Features/Peer/Sidebar] Toggle Aggregate Selected';
export const TOGGLE_LIMIT_TO_PAYMARKET  = '[Features/Peer/Sidebar] Toggle Limit To PayMarket';
export const TOGGLE_EXCLUDE_INDIRECT_JOB_MATCHES  = '[Features/Peer/Sidebar] Toggle Exclude Indirect Job Matches';
export const LOAD_PAYMARKET_INFORMATION  = '[Features/Peer/Sidebar] Load PayMarket Information';
export const LOAD_PAYMARKET_INFORMATION_SUCCESS  = '[Features/Peer/Sidebar] Load PayMarket Information Success';
export const CLEAR_ALL_SELECTIONS  = '[Features/Peer/Sidebar] Clear All Selections';
export const GET_MAP_DATA  = '[Features/Peer/Sidebar] Get Map Data';
export const TOGGLE_GROUP_SELECTIONS = '[Features/Peer/Sidebar] Toggle Group Selections';
export const LOAD_SYSTEM_FILTER = '[Features/Peer/Sidebar] Load System Filter';
export const LOAD_SYSTEM_FILTER_SUCCESS = '[Features/Peer/Sidebar] Load System Filter Success';
export const LIMIT_TO_EXCHANGE = '[Features/Peer/Sidebar] Limit to Exchange';
export const RESET_STATE = '[Features/Peer/Sidebar] Reset State';
export const APPLY_CUT_CRITERIA = '[Features/Peer/Sidebar] Apply Cut Criteria';
export const APPLY_SCOPE_CRITERIA = '[Features/Peer/Sidebar] Apply Scope Criteria';
export const SET_EXCHANGE_SCOPE_SELECTION = '[Features/Peer/Sidebar] Set Scope Selection';
export const SET_EXCHANGE_JOB_SELECTION = '[Features/Peer/Sidebar] Set Exchange Job Selection';
export const TOGGLE_INCLUDE_UNTAGGED_EMPLOYEES = '[Features/Peer/Sidebar] Toggle Include Untagged Employees';
export const LOAD_ASSOCIATED_EXCHANGE_JOBS =  '[Features/Peer/Sidebar] Load Associated Exchange Jobs';
export const LOAD_ASSOCIATED_EXCHANGE_JOBS_SUCCESS =  '[Features/Peer/Sidebar] Load Associated Exchange Jobs Success';
export const TOGGLE_AGGREGATE_SEARCH = '[Features/Peer/Sidebar] Toggle Aggregate Search';

export class LoadFilterAggregates implements Action {
  readonly type = LOAD_FILTER_AGGREGATES;

  constructor(public payload = true) {}
}

export class LoadFilterAggregatesSuccess implements Action {
  readonly type = LOAD_FILTER_AGGREGATES_SUCCESS;

  constructor(public payload: any) {}
}

export class LoadFilterAggregatesError implements Action {
  readonly type = LOAD_FILTER_AGGREGATES_ERROR;
}

export class ToggleAggregateSelected implements Action {
  readonly type = TOGGLE_AGGREGATE_SELECTED;

  constructor(public payload: AggregateSelectionInfo) {}
}

export class ToggleLimitToPayMarket implements Action {
  readonly type = TOGGLE_LIMIT_TO_PAYMARKET;
}

export class ToggleExcludeIndirectJobMatches implements Action {
  readonly type = TOGGLE_EXCLUDE_INDIRECT_JOB_MATCHES;
}

export class LoadPayMarketInformation implements Action {
  readonly type = LOAD_PAYMARKET_INFORMATION;

  constructor(public payload: number) {}
}

export class LoadPayMarketInformationSuccess implements Action {
  readonly type = LOAD_PAYMARKET_INFORMATION_SUCCESS;

  constructor(public payload: any) {}
}

export class ClearAllSelections implements Action {
  readonly type = CLEAR_ALL_SELECTIONS;
}

export class GetMapData implements Action {
  readonly type = GET_MAP_DATA;
}

export class ToggleGroupSelections implements Action {
  readonly type = TOGGLE_GROUP_SELECTIONS;

  constructor(public payload: ToggleAggregateGroupSelections) {}
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

export class ResetState implements Action {
  readonly type = RESET_STATE;
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

export class SetExchangeJobSelection implements Action {
  readonly type = SET_EXCHANGE_JOB_SELECTION;

  constructor(public payload: {exchangeJobId: number, similarExchangeJobIds: number[]}) {}
}

export class ToggleIncludeUntaggedEmployees implements Action {
  readonly type = TOGGLE_INCLUDE_UNTAGGED_EMPLOYEES;
}

export class LoadAssociatedExchangeJobs implements Action {
  readonly type = LOAD_ASSOCIATED_EXCHANGE_JOBS;

  constructor(public payload: {companyJobId: number}) { }
}

export class LoadAssociatedExchangeJobsSuccess implements Action {
  readonly type = LOAD_ASSOCIATED_EXCHANGE_JOBS_SUCCESS;

  constructor(public payload: ExchangeJobExchangeDetail[]) { }
}

export class ToggleAggregateSearch implements Action {
  readonly type = TOGGLE_AGGREGATE_SEARCH;

  constructor(public payload: string) {}
}

export type Actions
  = LoadFilterAggregates
  | LoadFilterAggregatesSuccess
  | LoadFilterAggregatesError
  | ToggleAggregateSelected
  | ToggleLimitToPayMarket
  | ToggleExcludeIndirectJobMatches
  | LoadPayMarketInformation
  | LoadPayMarketInformationSuccess
  | ClearAllSelections
  | ToggleGroupSelections
  | LoadSystemFilter
  | LoadSystemFilterSuccess
  | LimitToExchange
  | ResetState
  | ApplyCutCriteria
  | ApplyScopeCriteria
  | SetExchangeScopeSelection
  | SetExchangeJobSelection
  | ToggleIncludeUntaggedEmployees
  | LoadAssociatedExchangeJobs
  | LoadAssociatedExchangeJobsSuccess
  | ToggleAggregateSearch;
