import { Action } from '@ngrx/store';

import { AggregateSelectionInfo } from '../models';

export const LOADING_PEER_FILTERS  = '[Peer Add Data Cut/Filter Sidebar] Loading Peer Filters';
export const LOADING_PEER_FILTERS_SUCCESS  = '[Peer Add Data Cut/Filter Sidebar] Loading Peer Filters Success';
export const LOADING_PEER_FILTERS_ERROR  = '[Peer Add Data Cut/Filter Sidebar] Loading Peer Filters Error';
export const TOGGLE_AGGREGATE_SELECTED  = '[Peer Add Data Cut/Filter Sidebar] Toggle Aggregate Selected';
export const TOGGLE_LIMIT_TO_PAYMARKET  = '[Peer Add Data Cut/Filter Sidebar] Toggle Limit To PayMarket';
export const LOAD_PAYMARKET_INFORMATION  = '[Peer Add Data Cut/Filter Sidebar] Load PayMarket Information';
export const LOAD_PAYMARKET_INFORMATION_SUCCESS  = '[Peer Add Data Cut/Filter Sidebar] Load PayMarket Information Success';
export const CLEAR_SELECTIONS  = '[Peer Add Data Cut/Filter Sidebar] Clear Selections';

export class LoadingPeerFilters implements Action {
  readonly type = LOADING_PEER_FILTERS;
}

export class LoadingPeerFiltersSuccess implements Action {
  readonly type = LOADING_PEER_FILTERS_SUCCESS;

  constructor(public payload: any) {}
}

export class LoadingPeerFiltersError implements Action {
  readonly type = LOADING_PEER_FILTERS_ERROR;
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

export class ClearSelections implements Action {
  readonly type = CLEAR_SELECTIONS;

  constructor() {}
}

export type Actions
  = LoadingPeerFilters
  | LoadingPeerFiltersSuccess
  | LoadingPeerFiltersError
  | ToggleAggregateSelected
  | ToggleLimitToPayMarket
  | LoadPayMarketInformation
  | LoadPayMarketInformationSuccess
  | ClearSelections;
