import { Action } from '@ngrx/store';

import { SearchResponse } from 'libs/models/survey-search';

export const GET_RESULTS = '[Project Add Data/Search Results] Get Results';
export const GET_RESULTS_SUCCESS = '[Project Add Data/Search Results] Get Results Success';
export const GET_MORE_RESULTS = '[Project Add Data/Search Results] Get More Results';
export const GET_MORE_RESULTS_SUCCESS = '[Project Add Data/Search Results] Get More Results Success';
export const CLEAR_RESULTS = '[Project Add Data/Search Results] Clear Results';
export const OPEN_TOOLTIP = '[Project Add Data/Search Results] Open Tooltip';
export const CLOSE_TOOLTIP = '[Project Add Data/Search Results] Close Tooltip';

export class GetResults implements Action {
  readonly type = GET_RESULTS;
}

export class GetResultsSuccess implements Action {
  readonly type = GET_RESULTS_SUCCESS;

  constructor(public payload: SearchResponse) {}
}

export class GetMoreResults implements Action {
  readonly type = GET_MORE_RESULTS;
}

export class GetMoreResultsSuccess implements Action {
  readonly type = GET_MORE_RESULTS_SUCCESS;

  constructor(public payload: SearchResponse) {}
}

export class ClearResults implements Action {
  readonly type = CLEAR_RESULTS;
}

export class OpenTooltip implements Action {
  readonly type = OPEN_TOOLTIP;
}

export class CloseTooltip implements Action {
  readonly type = CLOSE_TOOLTIP;
}

export type Actions
  = GetResults
  | GetResultsSuccess
  | GetMoreResults
  | GetMoreResultsSuccess
  | ClearResults
  | OpenTooltip
  | CloseTooltip;
