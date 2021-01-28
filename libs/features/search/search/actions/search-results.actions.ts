import { Action } from '@ngrx/store';

import { State } from '../reducers/search-results.reducer';

export const GET_RESULTS = '[Search/Search Results] Get Results';
export const GET_RESULTS_SUCCESS = '[Search/Search Results] Get Results Success';
export const GET_MORE_RESULTS = '[Search/Search Results] Get More Results';
export const GET_MORE_RESULTS_SUCCESS = '[Search/Search Results] Get More Results Success';
export const GET_RESULTS_ERROR = '[Search/Search Results] Get Results Error';
export const CLEAR_RESULTS = '[Search/Search Results] Clear Results';
export const RESET = '[Search/Search Results] Reset';
export const SET = '[Search/Search Results] Set';

export class GetResults implements Action {
  readonly type = GET_RESULTS;
  constructor(public payload: {
    keepFilteredOutOptions: boolean,
    searchAggregation?: boolean,
    getSingledFilteredAggregates?: boolean,
    getChildFilteredAggregates?: boolean }) {}
}

export class GetResultsSuccess implements Action {
  readonly type = GET_RESULTS_SUCCESS;

  constructor(public payload: { totalRecordCount: number }) {}
}

export class GetMoreResults implements Action {
  readonly type = GET_MORE_RESULTS;
}

export class GetMoreResultsSuccess implements Action {
  readonly type = GET_MORE_RESULTS_SUCCESS;

  constructor() {}
}

export class GetResultsError implements Action {
  readonly type = GET_RESULTS_ERROR;

  constructor() {}
}

export class ClearResults implements Action {
  readonly type = CLEAR_RESULTS;
}

export class Reset implements Action {
  readonly type = RESET;
}

export class Set implements Action {
  readonly type = SET;

  constructor(public payload: State) { }
}

export type Actions
  = GetResults
  | GetResultsSuccess
  | GetMoreResults
  | GetMoreResultsSuccess
  | GetResultsError
  | ClearResults
  | Reset
  | Set;
