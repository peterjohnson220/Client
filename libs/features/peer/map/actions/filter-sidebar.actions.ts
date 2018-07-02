import { Action } from '@ngrx/store';

import { FilterAggregateGroup } from 'libs/models/peer';

import { AggregateSelectionInfo } from '../models';
import { SystemFilter, SystemFilterRequest, ExchangeDataCutSideBarInfo } from 'libs/models/peer';

export const LOAD_FILTER_AGGREGATES  = '[Features/Peer/Sidebar] Load Filter Aggregates';
export const LOAD_FILTER_AGGREGATES_SUCCESS  = '[Features/Peer/Sidebar] Load Filter Aggregates Success';
export const LOAD_FILTER_AGGREGATES_ERROR  = '[Features/Peer/Sidebar] Load Filter Aggregates Error';
export const TOGGLE_AGGREGATE_SELECTED  = '[Features/Peer/Sidebar] Toggle Aggregate Selected';
export const TOGGLE_LIMIT_TO_PAYMARKET  = '[Features/Peer/Sidebar] Toggle Limit To PayMarket';
export const LOAD_PAYMARKET_INFORMATION  = '[Features/Peer/Sidebar] Load PayMarket Information';
export const LOAD_PAYMARKET_INFORMATION_SUCCESS  = '[Features/Peer/Sidebar] Load PayMarket Information Success';
export const CLEAR_ALL_SELECTIONS  = '[Features/Peer/Sidebar] Clear All Selections';
export const CLEAR_GROUP_SELECTIONS  = '[Features/Peer/Sidebar] Clear Group Selections';
export const LOAD_SYSTEM_FILTER = '[Features/Peer/Sidebar] Load System Filter';
export const LOAD_SYSTEM_FILTER_SUCCESS = '[Features/Peer/Sidebar] Load System Filter Success';
export const LIMIT_TO_EXCHANGE = '[Features/Peer/Sidebar] Limit to Exchange';
export const RESET_STATE = '[Features/Peer/Sidebar] Reset State';
export const APPLY_CUT_CRITERIA = '[Features/Peer/Sidebar] Apply Cut Criteria';

export class LoadFilterAggregates implements Action {
  readonly type = LOAD_FILTER_AGGREGATES;
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

  constructor() {}
}

export class ClearGroupSelections implements Action {
  readonly type = CLEAR_GROUP_SELECTIONS;

  constructor(public payload: FilterAggregateGroup) {}
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

  constructor(public payload: ExchangeDataCutSideBarInfo) {}
}

export type Actions
  = LoadFilterAggregates
  | LoadFilterAggregatesSuccess
  | LoadFilterAggregatesError
  | ToggleAggregateSelected
  | ToggleLimitToPayMarket
  | LoadPayMarketInformation
  | LoadPayMarketInformationSuccess
  | ClearAllSelections
  | ClearGroupSelections
  | LoadSystemFilter
  | LoadSystemFilterSuccess
  | LimitToExchange
  | ResetState
  | ApplyCutCriteria;
