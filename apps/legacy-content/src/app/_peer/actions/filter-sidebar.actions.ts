import { Action } from '@ngrx/store';

import { FilterAggregateGroup } from 'libs/models/peer';

import { AggregateSelectionInfo } from '../models';

export const LOADING_FILTER_AGGREGATES  = '[Peer Add Data Cut/Filter Sidebar] Loading Filter Aggregates';
export const LOADING_FILTER_AGGREGATES_SUCCESS  = '[Peer Add Data Cut/Filter Sidebar] Loading Filter Aggregates Success';
export const LOADING_FILTER_AGGREGATES_ERROR  = '[Peer Add Data Cut/Filter Sidebar] Loading Filter Aggregates Error';
export const TOGGLE_AGGREGATE_SELECTED  = '[Peer Add Data Cut/Filter Sidebar] Toggle Aggregate Selected';
export const TOGGLE_LIMIT_TO_PAYMARKET  = '[Peer Add Data Cut/Filter Sidebar] Toggle Limit To PayMarket';
export const LOAD_PAYMARKET_INFORMATION  = '[Peer Add Data Cut/Filter Sidebar] Load PayMarket Information';
export const LOAD_PAYMARKET_INFORMATION_SUCCESS  = '[Peer Add Data Cut/Filter Sidebar] Load PayMarket Information Success';
export const CLEAR_ALL_SELECTIONS  = '[Peer Add Data Cut/Filter Sidebar] Clear All Selections';
export const CLEAR_GROUP_SELECTIONS  = '[Peer Add Data Cut/Filter Sidebar] Clear Group Selections';

export class LoadingFilterAggregates implements Action {
  readonly type = LOADING_FILTER_AGGREGATES;
}

export class LoadingFilterAggregatesSuccess implements Action {
  readonly type = LOADING_FILTER_AGGREGATES_SUCCESS;

  constructor(public payload: any) {}
}

export class LoadingFilterAggregatesError implements Action {
  readonly type = LOADING_FILTER_AGGREGATES_ERROR;
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

export type Actions
  = LoadingFilterAggregates
  | LoadingFilterAggregatesSuccess
  | LoadingFilterAggregatesError
  | ToggleAggregateSelected
  | ToggleLimitToPayMarket
  | LoadPayMarketInformation
  | LoadPayMarketInformationSuccess
  | ClearAllSelections
  | ClearGroupSelections;
